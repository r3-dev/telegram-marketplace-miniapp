import { A, useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { type ListResult } from 'pocketbase'
import { createEffect, createSignal, For, onCleanup, onMount } from 'solid-js'

import { usePocketBase } from '../../contexts/pocketbase'
import { Collections } from '../../pocketbase/pb-types'
import { LottieAnimation } from '../lottie-animation'
import type { StoresResponse } from '../../pocketbase/pb-types'

import '../../styles/index.css'

const storesDefaultValue = {
  items: [] as StoresResponse[]
} as ListResult<StoresResponse>

export function DashboardPage() {
  const { mainButton, backButton, initData } = useSDK()
  const pb = usePocketBase()
  const navigate = useNavigate()

  const [stores, setStores] =
    createSignal<ListResult<StoresResponse>>(storesDefaultValue)

  createEffect(async () => {
    const records = await pb
      .collection(Collections.Stores)
      .getList<StoresResponse>()

    setStores(records)
  })

  function goToCreateStore() {
    navigate('/create-store')
  }

  onMount(() => {
    mainButton().setText('Create store')
    mainButton().on('click', goToCreateStore)

    if (!mainButton().isVisible) mainButton().show()
    if (backButton().isVisible) backButton().hide()
  })

  onCleanup(() => {
    mainButton().off('click', goToCreateStore)
  })

  return (
    <div class="flex justify-center">
      <h1 style={{ 'font-weight': 'bold', 'font-size': '3rem' }}>
        Hello, {initData()?.user?.firstName}
      </h1>
      <LottieAnimation
        animationData={location.origin + '/lottie/congratulations.json'}
        autoplay={true}
        loop={true}
      />
      <For each={stores().items}>
        {(record) => (
          <div>
            <h2>{record.name}</h2>
            <A href={`/store/${record.id}`}>Go to store ({record.name})</A>
          </div>
        )}
      </For>
    </div>
  )
}
