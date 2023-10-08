import { usePocketBase } from "@/contexts/pocketbase"
import { Collections, OrderItemsRecord, OrdersRecord, OrdersResponse, ProductsRecord, UsersResponse } from "@/types/pb-types"
import { useBackButton } from "@/utils/useBackButton"
import { useMainButton } from "@/utils/useMainButton"
import { useNavigate, useParams } from "@solidjs/router"
import { MainButton } from "@tma.js/sdk"
import { Show, Suspense, createEffect, createResource, lazy } from "solid-js"
import { Image } from "@kobalte/core"
import { attachDevtoolsOverlay } from "@solid-devtools/overlay"
import "@/styles/image.css"
import "./styles.css"

export function MarketProductIdPage() {

  attachDevtoolsOverlay()
  const navigate = useNavigate()
  const params = useParams()
  const pb = usePocketBase()
  useBackButton(() => navigate(-1))

  function fetcher(productId: string) {
    return pb.collection(Collections.Products)
      .getOne<ProductsRecord>(productId)
  }

  const [product] = createResource(params.productId, fetcher)

  async function addToCart(mb: MainButton) {
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

      mb.setText("✅ В корзину").on('click', () => {
        navigate('/market/cart')
      })
    } catch (error) {
      console.error(error)
    } finally {
      mb.hideProgress().enable()
    }
  }

  const mb = useMainButton(addToCart)

  createEffect(() => {
    mb.setText(`Добавить в корзину $${product()?.price}`)
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
