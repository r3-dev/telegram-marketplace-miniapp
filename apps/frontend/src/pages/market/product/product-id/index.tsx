import { Image } from '@kobalte/core'
import { useNavigate, useParams } from '@solidjs/router'
import { createEffect, createResource, onCleanup, Show } from 'solid-js'

import { usePocketBase } from '@/contexts/pocketbase'
import {
  Collections,
  OrderItemsRecord,
  OrdersRecord,
  OrdersResponse,
  OrdersStatusOptions,
  ProductsRecord,
  UsersResponse
} from '@/types/pb-types'
import { useBackButton } from '@/utils/useBackButton'
import { useMainButton } from '@/utils/useMainButton'

import '@/styles/image.css'
import './styles.css'

export function MarketProductIdPage() {
  const navigate = useNavigate()
  const params = useParams()
  const pb = usePocketBase()
  const mb = useMainButton()
  useBackButton(() => navigate(-1))

  async function fetcherProduct(productId: string) {
    return pb.collection(Collections.Products).getOne<ProductsRecord>(productId)
  }

  async function fetcherOrder(productId: string) {
    return pb
      .collection(Collections.OrderItems)
      .getFirstListItem<OrderItemsRecord>(
        `product.id = "${productId}" && order.status = "BuyerInProcess"`
      )
  }

  const [product] = createResource(params.productId, fetcherProduct)
  const [order] = createResource(params.productId, fetcherOrder)

  const ADD_TO_CART = () => `Add to cart $${product()?.price}`
  const GO_TO_CART = '📦 In cart'

  async function addToCart() {
    mb.showProgress().disable()
    const userId = (pb.authStore.model as UsersResponse).id

    try {
      let getOrderResponse: OrdersResponse

      //Ищем корзину
      try {
        getOrderResponse = await pb
          .collection(Collections.Orders)
          .getFirstListItem(
            `user.id = "${userId}" && status = "BuyerInProcess"`
          )
      } catch (err) {
        //Не нашли - создаём новую
        const newOrder: OrdersRecord = {
          user: userId,
          status: OrdersStatusOptions.BuyerInProcess
        }

        getOrderResponse = await pb
          .collection(Collections.Orders)
          .create<OrdersResponse>(newOrder)
          .catch((err) => {
            throw err
          })
      }

      const newOrderItem: OrderItemsRecord = {
        order: getOrderResponse.id,
        product: params.productId,
        quantity: 1
      }

      await pb
        .collection(Collections.OrderItems)
        .create<OrderItemsRecord>(newOrderItem)
        .catch((err) => {
          throw err
        })

      mb.off('click', addToCart)
      mb.setText(GO_TO_CART).on('click', goToCart)
    } catch (error) {
      console.error(error)
    } finally {
      mb.hideProgress().enable()
    }
  }

  function goToCart() {
    mb.off('click', goToCart)
    navigate('/market/cart')
  }

  createEffect(() => {
    mb.off('click', goToCart)
    mb.off('click', addToCart)
    if (order.state != 'ready') {
      mb.setText(ADD_TO_CART()).on('click', addToCart)
    } else {
      mb.setText(GO_TO_CART).on('click', goToCart)
    }
  })

  onCleanup(() => {
    mb.off('click', goToCart)
    mb.off('click', addToCart)
  })

  return (
    <main class="flex flex-col items-center">
      <Show
        when={product()}
        fallback={<div>Loading...</div>}
      >
        {(p) => (
          <>
            <Image.Root class="rounded-3xl w-3/4 aspect-square">
              {p().images && p().images && (
                <Image.Img
                  class="image__img"
                  //FIX: сделать нормальную проверку на пустой массив
                  src={pb.files.getUrl(p(), p().images![0])}
                />
              )}
              <Image.Fallback class="image__fallback bg-tg-bg-secondary rounded-lg">
                <span class="text-8xl">📦</span>
              </Image.Fallback>
            </Image.Root>
            <h5 class="text-tg-hint"></h5>
            <div class="flex justify-between w-full mt-6">
              <div class="text-left">
                <div class="text-tg-hint text-sm">Title</div>
                <div class="text-lg">{p().name}</div>
              </div>
              <div class="text-right">
                <div class="text-tg-hint text-sm">Price</div>
                <div class="text-lg">{p().price}$</div>
              </div>
            </div>
            <div class="text-left mr-auto mt-5">
              <div class="text-tg-hint text-sm">Description</div>
              <div class="text-left">{p().description}</div>
            </div>
          </>
        )}
      </Show>
    </main>
  )
}
