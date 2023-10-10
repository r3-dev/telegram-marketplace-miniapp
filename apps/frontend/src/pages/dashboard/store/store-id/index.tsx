import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'

import { DashboardStoreLayout } from '@/components/dashboard-store-layout'
import { usePocketBase } from '@/contexts/pocketbase'
import { Collections } from '@/types/pb-types'

export function StoreIdPage() {
  const sdk = useSDK()
  const navigate = useNavigate()
  const params = useParams()
  const pb = usePocketBase()

  onMount(() => {
    sdk.webApp()
    if (sdk.mainButton().isVisible) sdk.mainButton().hide()
    if (!sdk.backButton().isVisible) sdk.backButton().show()

    sdk.backButton().on('click', handleGoBack)
  })

  onCleanup(() => {
    sdk.backButton().off('click', handleGoBack)
  })

  function handleGoBack() {
    navigate('/dashboard')
  }

  function handleCatalogClick() {
    navigate(`/dashboard/store/${params.storeId}/products`)
  }

  async function handleDeleteStoreClick() {
    const deleteConfirm = await sdk.popup().open({
      message: 'Are you sure you want to delete this store?',
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
      await pb.collection(Collections.Stores).delete(params.storeId)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <DashboardStoreLayout>
        <div class="flex flex-col">
          <div
            onClick={handleCatalogClick}
            class="flex items-center p-4 space-x-4 cursor-pointer hover:bg-tg-bg-secondary rounded"
          >
            <div class="flex-1 min-w-0">
              <p class="text-base font-medium truncate">Catalog</p>
            </div>
          </div>
          <div
            onClick={handleDeleteStoreClick}
            class="flex items-center p-4 space-x-4 cursor-pointer hover:bg-tg-bg-secondary rounded text-red-500"
          >
            <div class="flex-1 min-w-0">
              <p class="text-base font-medium truncate">Delete store</p>
            </div>
          </div>
        </div>
      </DashboardStoreLayout>
    </>
  )
}
