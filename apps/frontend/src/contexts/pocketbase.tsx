import { useSDK } from '@tma.js/sdk-solid'
import PocketBase from 'pocketbase'
import { createContext, createEffect, useContext } from 'solid-js'
import type { ApiClient } from '@/services/api-client-service'
import type { ParentComponent } from 'solid-js'

import { ApiService } from '@/services/api-client-service'

const pb_url = import.meta.env.PUBLIC_POCKETBASE_URL

const PocketBaseContext = createContext<PocketBase>(undefined, {
  name: 'PocketBaseContext'
})

const ApiContext = createContext<ApiClient>(undefined, {
  name: 'ApiContext'
})

export function useApi() {
  const context = useContext(ApiContext)

  if (context === undefined) {
    throw new Error(
      `${useApi.name} hook was used outside of ${ApiProvider.name}.`
    )
  }

  return context
}

export function usePocketBase() {
  const context = useContext(PocketBaseContext)

  if (context === undefined) {
    throw new Error(
      `${usePocketBase.name} hook was used outside of ${PocketbaseProvider.name}.`
    )
  }

  return context
}

export const ApiProvider: ParentComponent = (props) => {
  const sdk = useSDK()
  const pb = new PocketBase(pb_url)

  pb.beforeSend = function (url, options) {
    options.headers = Object.assign({}, options.headers, {
      'X-Init-Data': sdk.initDataRaw()
    })

    return { url, options }
  }

  createEffect(async () => {
    await pb
      .collection('users')
      .authWithPassword('USERNAMELESS', 'PASSWORDLESS', {
        headers: {
          'X-Init-Data': sdk.initDataRaw()
        }
      })
  })

  const apiClient = ApiService(pb)

  return (
    <ApiContext.Provider value={apiClient}>
      {props.children}
    </ApiContext.Provider>
  )
}

export const PocketbaseProvider: ParentComponent = (props) => {
  const sdk = useSDK()
  const pb = new PocketBase(pb_url)

  pb.beforeSend = function (url, options) {
    options.headers = Object.assign({}, options.headers, {
      'X-Init-Data': sdk.initDataRaw()
    })

    return { url, options }
  }

  createEffect(async () => {
    await pb
      .collection('users')
      .authWithPassword('USERNAMELESS', 'PASSWORDLESS', {
        headers: {
          'X-Init-Data': sdk.initDataRaw()
        }
      })
  })

  return (
    <PocketBaseContext.Provider value={pb}>
      {props.children}
    </PocketBaseContext.Provider>
  )
}
