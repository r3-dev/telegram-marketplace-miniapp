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
    title: 'Каталог',
    link: '/dashboard/store/:storeId/products'
  },
  {
    title: 'Настройки',
    link: '/dashboard/store/:storeId/settings'
  }
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
              <Separator.Root class="border-none bg-tg-bg-secondary" />
            </>
          )}
        </For>
      </div>
    </>
  )
}
