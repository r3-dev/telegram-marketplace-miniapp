import { Image } from '@kobalte/core'
import { useSDK } from '@tma.js/sdk-solid'
import { For, onMount } from 'solid-js'

import '../../../styles/image.css'
import './welcome.css'

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

  onMount(() => {
    sdk.mainButton().setText('Создать магазин').show()
  })

  return (
    <div class="flex justify-center flex-col py-4">
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
