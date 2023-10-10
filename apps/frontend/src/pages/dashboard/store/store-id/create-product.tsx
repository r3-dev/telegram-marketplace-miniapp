import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

import { CreateProduct } from '@/components/create-product/create-product'
import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, StoresResponse } from '@/types/pb-types'

export function CreateProductPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { mainButton, backButton } = useSDK()
  const pb = usePocketBase()
  const [store, setStore] = createSignal<StoresResponse>()

  console.log(params)
  console.log()

  function goToNext() {
    mainButton().disable()

    navigate(`/dashboard/store/${params.storeId}/products`)
  }

  function onBack() {
    navigate(`/dashboard/store/${params.storeId}`)
  }

  onMount(() => {
    mainButton().setText('Add Product')

    mainButton().on('click', goToNext)
    backButton().on('click', onBack)

    if (!mainButton().isVisible) mainButton().show()
    if (!backButton().isVisible) backButton().show()

    if (!mainButton().isEnabled) mainButton().enable()
  })

  onCleanup(() => {
    mainButton().off('click', goToNext)
    backButton().off('click', onBack)
  })

  createEffect(() => {
    pb.collection(Collections.Stores)
      .getOne<StoresResponse>(params.storeId)
      .then((_store) => {
        setStore(_store)
      })
      .catch((err) => {
        console.error(err)
      })
  })

  return <CreateProduct store={store()} />
}
