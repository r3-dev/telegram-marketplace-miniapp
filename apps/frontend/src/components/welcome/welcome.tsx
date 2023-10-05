import { Image } from '@kobalte/core'
import { useSDK } from '@tma.js/sdk-solid'
import { createEffect, createSignal, For, Show } from 'solid-js'

import '../../styles/image.css'
import './welcome.css'

import { useNavigate } from '@solidjs/router'
import type { ListResult } from 'pocketbase'

import { usePocketBase } from '../../contexts/pocketbase'
import { Collections, StoresResponse } from '../../types/pb-types'

const storesDefaultValue = {
  items: [] as StoresResponse[]
} as ListResult<StoresResponse>

export function Welcome() {
  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue)

  const sdk = useSDK()
  const navigate = useNavigate()
  const pb = usePocketBase()

  createEffect(async () => {
    const user = sdk.initData()?.user
    if (!user) return

    const storesResponse = await pb
      .collection(Collections.Stores)
      .getList<StoresResponse>()
      .catch(() => {
        throw new Error('Не удалось получить список магазинов')
      })

    setStores(storesResponse)
  })

  function handleStoreClick(store: StoresResponse) {
    navigate(`/dashboard/store/${store.id}`)
  }

  return (
    <div class="flex justify-center flex-col">
      <h1 class="text-lg text-center">
        Привет, {sdk.initData()?.user?.firstName}!
      </h1>
      <p class="text-sm text-center mt-4 mb-4">
        <Show
          when={stores().items.length === 0}
          fallback="Выберите магазин для редактирования"
        >
          У вас пока нет магазинов
        </Show>
      </p>
      <div class="flex flex-col">
        <For each={stores().items}>
          {(store) => (
            <div
              onClick={() => handleStoreClick(store)}
              class="store__item flex items-center p-2 space-x-4cursor-pointer"
            >
              <div class="flex-shrink-0">
                <Image.Root class="image">
                  <Image.Img
                    class="image__img"
                    src={store.avatar}
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
