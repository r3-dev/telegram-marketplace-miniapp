import { usePocketBase } from "@/contexts/pocketbase"
import { Collections, OrderItemsRecord, OrdersRecord, OrdersResponse, ProductsRecord, UsersResponse } from "@/types/pb-types"
import { useBackButton } from "@/utils/useBackButton"
import { useMainButton } from "@/utils/useMainButton"
import { useNavigate, useParams } from "@solidjs/router"
import { Show, createEffect, createResource } from "solid-js"
import { Image } from "@kobalte/core"
import { attachDevtoolsOverlay } from "@solid-devtools/overlay"
import "@/styles/image.css"
import "./styles.css"

export function MarketProductIdPage() {

  attachDevtoolsOverlay()
  const navigate = useNavigate()
  const params = useParams()
  const pb = usePocketBase()
  const mb = useMainButton()
  useBackButton(() => navigate(-1))

  async function fetcherProduct(productId: string) {
    return pb.collection(Collections.Products)
      .getOne<ProductsRecord>(productId)
  }

  async function fetcherOrder(productId: string) {
    return pb.collection(Collections.OrderItems)
      .getFirstListItem<OrderItemsRecord>(`product.id = "${productId}"`)
  }

  const [product] = createResource(params.productId, fetcherProduct)
  const [order] = createResource(params.productId, fetcherOrder)

  const ADD_TO_CART = () => `Добавить в корзину $${product()?.price}`
  const GO_TO_CART = "✅ В корзину"

  async function addToCart() {
    mb.showProgress().disable()
    const userId = (pb.authStore.model as UsersResponse).id

    try {
      let getOrderResponse: OrdersResponse

      //Ищем корзину
      try {
        getOrderResponse = await pb.collection(Collections.Orders)
          .getFirstListItem(`user.id = "${userId}"`)
      }
      catch (err) {
        //Не нашли - создаём новую
        const newOrder: OrdersRecord = {
          user: userId
        }

        getOrderResponse = await pb.collection(Collections.Orders)
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
      mb.setText(GO_TO_CART).on('click', () => {
        navigate('/market/cart')
      })
    } catch (error) {
      console.error(error)
    } finally {
      mb.hideProgress().enable()
    }
  }

  function goToCart() {
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

  return (
    <main class="flex flex-col items-center">
      <Show when={product()} fallback={<div>Loading...</div>}>
        {(p) =>
          <>
            <Image.Root class="rounded-3xl w-3/5">
              {p().images && p().images && (<Image.Img
                class="image__img"
                //FIX: сделать нормальную проверку на пустой массив
                src={pb.files.getUrl(p(), p().images![0])} />)}
              <Image.Fallback class="image__fallback">
                {p().name.charAt(0).toUpperCase()}
              </Image.Fallback>
            </Image.Root>
            <div class="text-lg mt-6">{p().name}</div>
            <div class="mt-5 text-left">{p().description}</div>
          </>
        }
      </Show>
    </main>
  )
}
