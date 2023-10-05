import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { createSignal, onCleanup, onMount } from 'solid-js'

import { usePocketBase } from '../../../../contexts/pocketbase'
import { Collections, StoresResponse } from '../../../../types/pb-types'

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

  return (
    <div>
      <h1>Store {store().name}</h1>
    </div>
  )
}
