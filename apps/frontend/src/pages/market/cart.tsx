import { Button, Image } from '@kobalte/core'
import { useNavigate } from '@solidjs/router'
import { BsBoxSeamFill, BsTrashFill } from 'solid-icons/bs'
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  Suspense
} from 'solid-js'

import { usePocketBase } from '@/contexts/pocketbase'
import {
  Collections,
  OrderItemsResponse,
  OrdersStatusOptions,
  ProductsResponse,
  UsersResponse
} from '@/types/pb-types'
import { useBackButton } from '@/utils/useBackButton'

import '@/styles/button.css'

import { Success } from '@/components/success/success'
import { useMainButton } from '@/utils/useMainButton'
import cartStyles from './cart.module.css'

type Texpand = {
  product: ProductsResponse
}

export function MarketCartPage() {
  const pb = usePocketBase()
  const [isBuyed, setIsBuyed] = createSignal(false)

  const fetchOrdersItems = async () => {
    return pb
      .collection(Collections.OrderItems)
      .getFullList<OrderItemsResponse<Texpand>>({
        filter: `order.user.id = "${
          (pb.authStore.model as UsersResponse).id
        }" && order.status = "BuyerInProcess"`,
        expand: 'product'
      })
  }

  const [orderItems, { refetch }] = createResource(fetchOrdersItems)
  const quantity = () =>
    orderItems()?.reduce((acc, item) => acc + item.quantity, 0)

  const navigate = useNavigate()
  useBackButton(() => navigate(-1))
  const mb = useMainButton(buy)

  createEffect(() => {
    const price = orderItems()?.reduce(
      (acc, item) => acc + item.quantity * item.expand?.product?.price!,
      0
    )
    if (!price) {
      mb.hide().disable()
      return
    }
    mb.show().enable()
    mb.setText(`Checkout $${price}`)
  })

  async function clearCart() {
    try {
      await pb.collection(Collections.Orders).delete(orderItems()![0].order)
      refetch()
      mb.hide().disable()
    } catch (e) {
      console.error(e)
    }
  }

  async function buy() {
    try {
      await pb.collection(Collections.Orders).update(orderItems()![0].order, {
        status: OrdersStatusOptions.WaitForVendor
      })
      mb.off('click', buy)
      setIsBuyed(true)
    } catch (e) {
      console.error(e)
    }
  }

  async function removeProduct(id: string) {
    try {
      await pb.collection(Collections.OrderItems).delete(id)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Show
      when={!isBuyed()}
      fallback={
        <Success
          nextButtonLink="/market"
          nextButtonText="Back to market"
          text="Thank you for purchase!"
        />
      }
    >
      <div>
        <header class="text-left text-2xl my-2">
          Cart
          {quantity() && (
            <Button.Root
              onClick={clearCart}
              class="button button__status-bar float-right"
            >
              Clear
            </Button.Root>
          )}
        </header>
        <Suspense fallback={<div>Загрузка...</div>}>
          <For
            each={orderItems()}
            fallback={
              <div class="text-tg-hint">
                Nothing here. Go back and find some products you like 🤓
              </div>
            }
          >
            {(item) => (
              <div class={`${cartStyles['order-item']} gap-x-4 my-4`}>
                <Image.Root
                  class={`${cartStyles.image} image row-start-1 row-end-3 w-32`}
                >
                  <Image.Img
                    class="image__img"
                    src={pb.files.getUrl(
                      item.expand?.product!,
                      item.expand?.product.images[0]!,
                      { thumb: '0x128' }
                    )}
                  />
                  <Image.Fallback class="image__fallback">
                    {item.expand?.product.name.charAt(0).toUpperCase()}
                  </Image.Fallback>
                </Image.Root>
                <div class="overflow-hidden whitespace-nowrap text-ellipsis">
                  {item.expand?.product.name}
                </div>
                <div>${item.expand?.product.price}</div>
                <Button.Root
                  onClick={() => removeProduct(item.id)}
                  class={`${cartStyles.button} button row-start-1 row-end-3 col-start-3 w-10 h-10`}
                >
                  <BsTrashFill />
                </Button.Root>
              </div>
            )}
          </For>
        </Suspense>
        <footer>
          {quantity() && (
            <>
              <BsBoxSeamFill />
              Amount: {quantity()}
            </>
          )}
        </footer>
      </div>
    </Show>
  )
}
