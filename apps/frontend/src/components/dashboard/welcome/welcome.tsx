import { Image } from '@kobalte/core'
import { useSDK } from '@tma.js/sdk-solid'
import { For, onCleanup, onMount } from 'solid-js'

import '../../../styles/image.css'
import './welcome.css'

import { useNavigate } from '@solidjs/router'

const MOCK_STORES = [
  {
    name: 'Apple',
    image: 'https://placehold.co/64x64.png'
  },
  {
    name: 'Samsung',
    image: 'https://placehold.co/64x64.png'
  },
  {
    name: 'Xiaomi',
    image: 'https://placehold.co/64x64.png'
  },
  {
    name: 'Google'
  }
]

export function Welcome() {
  const sdk = useSDK()
  const navigate = useNavigate()

  function handleCreateStore() {
    sdk.mainButton().disable()

    navigate('/dashboard/create-store')
  }

  onMount(() => {
    sdk.mainButton().on('click', handleCreateStore)
    sdk.mainButton().setText('Создать магазин')

    if (!sdk.mainButton().isVisible) sdk.mainButton().show()
    if (sdk.backButton().isVisible) sdk.backButton().hide()

    if (!sdk.mainButton().isEnabled) sdk.mainButton().enable()
  })

  onCleanup(() => {
    sdk.mainButton().off('click', handleCreateStore)
  })

  return (
    <div class="flex justify-center flex-col">
      <h1 class="text-lg text-center">
        Привет, {sdk.initData()?.user?.firstName}!
      </h1>
      <p class="text-sm text-center mt-4 mb-4">
        Выберите магазин для редактирования
      </p>
      <div class="flex flex-col">
        <For each={MOCK_STORES}>
          {(store) => (
            <div class="store__item flex items-center p-2 space-x-4">
              <div class="flex-shrink-0">
                <Image.Root class="image">
                  <Image.Img
                    class="image__img"
                    src={store.image}
                  />
                  <Image.Fallback class="image__fallback">
                    {store.name.charAt(0).toUpperCase()}
                  </Image.Fallback>
                </Image.Root>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{store.name}</p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
