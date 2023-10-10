import { Separator } from '@kobalte/core'
import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { createSignal, For, onCleanup, onMount } from 'solid-js'

import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, StoresResponse } from '@/types/pb-types'

interface MenuItem {
  title: string
  link: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Catalog',
    link: '/dashboard/store/:storeId/products'
  }
  // {
  //   title: 'Settings',
  //   link: '/dashboard/store/:storeId/settings'
  // }
]

export function StoreIdPage() {
  const [store, setStore] = createSignal<StoresResponse>({} as StoresResponse)

  const sdk = useSDK()
  const navigate = useNavigate()
  const params = useParams()
  const pb = usePocketBase()

  onMount(() => {
    sdk.webApp()
    if (sdk.mainButton().isVisible) sdk.mainButton().hide()
    if (!sdk.backButton().isVisible) sdk.backButton().show()

    sdk.backButton().on('click', handleGoBack)

    pb.collection(Collections.Stores)
      .getOne<StoresResponse>(params.storeId)
      .then((store) => {
        setStore(store)
      })
  })

  onCleanup(() => {
    sdk.backButton().off('click', handleGoBack)
  })

  function handleGoBack() {
    navigate('/dashboard')
  }

  function handleMenuClick(menuItem: MenuItem) {
    navigate(menuItem.link)
  }
  async function handleDeleteStoreClick() {
    const deleteConfirm = await sdk.popup().open({
      message: 'Are you sure you want to delete this store?',
      buttons: [
        {
          type: 'cancel',
          id: 'cancel'
        },
        {
          type: 'destructive',
          text: 'Delete',
          id: 'delete'
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
      <h1 class="text-2xl my-2">Store {store().name}</h1>
      <div class="flex flex-col">
        <For each={menuItems}>
          {(menuItem) => (
            <>
              <div
                onClick={() => handleMenuClick(menuItem)}
                class="flex items-center p-4 space-x-4 cursor-pointer hover:bg-tg-bg-secondary rounded"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-base font-medium truncate">{menuItem.title}</p>
                </div>
              </div>
            </>
          )}
        </For>
        <div
          onClick={handleDeleteStoreClick}
          class="flex items-center p-4 space-x-4 cursor-pointer hover:bg-tg-bg-secondary rounded text-red-500"
        >
          <div class="flex-1 min-w-0">
            <p class="text-base font-medium truncate">Delete store</p>
          </div>
        </div>
      </div>
    </>
  )
}
