import { Image } from '@kobalte/core'
import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { For, onCleanup, onMount, Show } from 'solid-js'

import { DashboardStoreLayout } from '@/components/dashboard-store-layout'
import { useApi } from '@/contexts/pocketbase'
import { ProductsResponse } from '@/types/pb-types'

export function StoreProductsPage() {
  const params = useParams()
  const navigate = useNavigate()
  const api = useApi()

  const [products, { refetch: refetchProducts, mutate: mutateProducts }] =
    api.products.getFullList({
      filter: `store="${params.storeId}"`
    })

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

    mutateProducts((prev) => prev?.filter((p) => p.id !== _product.id))
    const deleteSuccess = await api.products.delete(_product.id)

    if (!deleteSuccess) {
      mutateProducts((prev) => prev?.concat(_product))
      return
    }

    refetchProducts()
  }

  return (
    <>
      <DashboardStoreLayout>
        <h1>Current Product List</h1>
        <div class="flex flex-col">
          <Show
            when={!products.error}
            fallback={products.error.message}
          >
            <Show
              when={products()}
              fallback={<div>Loading...</div>}
              keyed
            >
              {(_products) => (
                <For each={_products}>
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
              )}
            </Show>
          </Show>
        </div>
      </DashboardStoreLayout>
    </>
  )
}
