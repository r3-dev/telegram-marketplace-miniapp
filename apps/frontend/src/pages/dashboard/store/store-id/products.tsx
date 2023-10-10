import { Image } from '@kobalte/core'
import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import PocketBase from 'pocketbase'
import { createResource, For, onCleanup, onMount, Show } from 'solid-js'

import { DashboardStoreLayout } from '@/components/dashboard-store-layout'
import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, ProductsResponse } from '@/types/pb-types'

export function StoreProductsPage() {
  const params = useParams()
  const pb = usePocketBase()
  const navigate = useNavigate()

  const [products, { refetch: refetchProducts }] = createResource(
    { storeId: params.storeId, _pb: pb },
    fetchProducts
  )

  const sdk = useSDK()

  onMount(() => {
    sdk.mainButton().on('click', handleAddProduct)
    sdk.backButton().on('click', handleBackClick)
    sdk.mainButton().setText('Add product')

    if (!sdk.mainButton().isVisible) sdk.mainButton().show()
    if (!sdk.backButton().isVisible) sdk.backButton().show()

    if (!sdk.mainButton().isEnabled) sdk.mainButton().enable()
  })

  onCleanup(() => {
    sdk.mainButton().off('click', handleAddProduct)
    sdk.backButton().off('click', handleBackClick)
  })

  function handleAddProduct() {
    sdk.mainButton().disable()

    navigate(`/dashboard/store/${params.storeId}/create-product`)
  }

  function handleBackClick() {
    navigate(`/dashboard/store/${params.storeId}`)
  }

  function fetchProducts({
    storeId,
    _pb
  }: {
    storeId: string
    _pb: PocketBase
  }) {
    console.log('fetchProducts', storeId)
    try {
      const req = _pb
        .collection(Collections.Products)
        .getFullList<ProductsResponse>({
          filter: `store="${storeId}"`
        })

      return req
    } catch (error) {
      console.log(error)
      throw new Error('Не удалось получить список товаров')
    }
  }

  async function handleProductClick(_product: ProductsResponse) {
    // popup to delete store
    const deleteConfirm = await sdk.popup().open({
      message: 'Are you sure you want to delete this product?',
      title: _product.name,
      buttons: [
        {
          type: 'destructive',
          text: 'Delete',
          id: 'delete'
        },
        {
          type: 'cancel',
          id: 'cancel'
        }
      ]
    })

    if (deleteConfirm === 'cancel') return

    try {
      console.log('delete product', _product.id)

      await pb.collection(Collections.Products).delete(_product.id)
      refetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <DashboardStoreLayout>
        <h1>Current Product List</h1>
        <div class="flex flex-col">
          <Show
            when={products() !== undefined && products()!.length > 0}
            fallback={<div class="text-tg-hint">There are no products yet</div>}
          >
            <For each={products()}>
              {(_product) => (
                <div
                  onClick={() => handleProductClick(_product)}
                  class="store__item flex items-center p-2 space-x-4 cursor-pointer"
                >
                  <div class="flex-shrink-0">
                    <Image.Root class="image">
                      <Image.Img
                        class="image__img"
                        src={
                          _product.images
                            ? _product.images[0]
                            : 'https://via.placeholder.com/128'
                        }
                      />
                      <Image.Fallback class="image__fallback">
                        {_product.name.charAt(0).toUpperCase()}
                      </Image.Fallback>
                    </Image.Root>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{_product.name}</p>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{_product.price}$</p>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </DashboardStoreLayout>
    </>
  )
}
