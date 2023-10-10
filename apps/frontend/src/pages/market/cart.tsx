import { Button, Image } from "@kobalte/core"
import { usePocketBase } from "@/contexts/pocketbase"
import { Collections, OrderItemsResponse, OrdersRecord, OrdersStatusOptions, ProductsResponse, UsersResponse } from "@/types/pb-types"
import { useBackButton } from "@/utils/useBackButton"
import { useNavigate } from "@solidjs/router"
import { For, Suspense, createEffect, createResource } from "solid-js"
import { BsBoxSeamFill, BsTrashFill } from "solid-icons/bs"
import "@/styles/button.css"
import cartStyles from "./cart.module.css"
import { useMainButton } from "@/utils/useMainButton"

type Texpand = {
  product: ProductsResponse
}

export function MarketCartPage() {
  const pb = usePocketBase()

  const fetchOrdersItems = async () => {
    return pb.collection(Collections.OrderItems)
      .getFullList<OrderItemsResponse<Texpand>>({ filter: `order.user.id = "${(pb.authStore.model as UsersResponse).id}" && order.status = "BuyerInProcess"`, expand: 'product' })
  }

  const [orderItems, { refetch }] = createResource(fetchOrdersItems)
  const quantity = () => orderItems()?.reduce((acc, item) => acc + item.quantity, 0)

  const navigate = useNavigate()
  useBackButton(() => navigate(-1))
  const mb = useMainButton(buy)

  createEffect(() => {
    const price = orderItems()?.reduce((acc, item) => acc + item.quantity * item.expand?.product?.price!, 0)
    if (!price) {
      mb.hide().disable()
      return
    }
    mb.setText(`Купить $${price}`)
  })

  async function clearCart() {
    try {
      await pb.collection(Collections.Orders).delete(orderItems()![0].order)
      refetch()
      mb.hide().disable()
    }
    catch (e) {
      console.error(e)
    }
  }

  async function buy() {
    try {
      await pb.collection(Collections.Orders).update(orderItems()![0].order, {
        status: OrdersStatusOptions.WaitForVendor
      })
      mb.off('click', buy)
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
    <div>
      <header class="text-left">
        Корзина{quantity()
          && <Button.Root onClick={clearCart} class="button button__status-bar float-right">Очистить</Button.Root>}
      </header>
      <Suspense fallback={<div>Загрузка...</div>}>
        <For each={orderItems()} fallback={<div>Пусто 😢</div>}>
          {(item) => <div class={`${cartStyles['order-item']} gap-x-4 my-4`}>
            <Image.Root class={`${cartStyles.image} image row-start-1 row-end-3 w-32`}>
              <Image.Img
                class="image__img"
                src={pb.files.getUrl(item.expand?.product!, item.expand?.product.images[0]!, { 'thumb': '0x128', })} />
              <Image.Fallback class="image__fallback">
                {item.expand?.product.name.charAt(0).toUpperCase()}
              </Image.Fallback>
            </Image.Root>
            <div class="overflow-hidden whitespace-nowrap text-ellipsis">{item.expand?.product.name}</div>
            <div>${item.expand?.product.price}</div>
            <Button.Root onClick={() => removeProduct(item.id)} class={`${cartStyles.button} button row-start-1 row-end-3 col-start-3 w-10 h-10`}><BsTrashFill /></Button.Root>
          </div>}
        </For>
      </Suspense>
      <footer>
        {quantity() && <><BsBoxSeamFill />Количество: {quantity()}</>}</footer>
    </div>
  )
}
