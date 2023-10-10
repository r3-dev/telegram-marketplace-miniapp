import { useParams } from '@solidjs/router'
import { createEffect, createSignal, ParentProps } from 'solid-js'

import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, StoresResponse } from '@/types/pb-types'

export function DashboardStoreLayout(props: ParentProps) {
  const [store, setStore] = createSignal<StoresResponse>({} as StoresResponse)

  const params = useParams()
  const pb = usePocketBase()

  createEffect(() => {
    //Fetch store
    pb.collection(Collections.Stores)
      .getOne<StoresResponse>(params.storeId)
      .then((_store) => {
        setStore(_store)
      })
      .catch((err) => {
        console.error(err)
      })
  })

  return (
    <>
      <h1 class="text-2xl my-2">
        Store
        <span class="text-tg-link font-bold"> {store().name}</span>
      </h1>
      {props.children}
    </>
  )
}
