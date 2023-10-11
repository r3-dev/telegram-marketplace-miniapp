import PocketBase, {
  ListResult,
  RecordFullListOptions,
  RecordOptions,
  RecordService
} from 'pocketbase'
import { createResource, ResourceReturn } from 'solid-js'

import { CollectionRecords, CollectionResponses } from '@/types/pb-types'

export type ApiClient = {
  [K in keyof CollectionResponses]: ProxyHandler<K>
}
type ProxyHandlerReturn<T> = ResourceReturn<T, unknown>
type ProxyHandler<K extends keyof CollectionResponses> = {
  getOne: (
    ...params: Parameters<RecordService['getOne']>
  ) => ProxyHandlerReturn<CollectionResponses[K]>
  getList: (
    ...params: Parameters<RecordService['getList']>
  ) => ProxyHandlerReturn<ListResult<CollectionResponses[K]>>
  create: (
    bodyParams?: CollectionRecords[K],
    options?: RecordOptions
  ) => ProxyHandlerReturn<CollectionResponses[K]>
  getFullList: (
    options?: RecordFullListOptions
  ) => ProxyHandlerReturn<CollectionResponses[K][]>
  delete: (...params: Parameters<RecordService['delete']>) => Promise<boolean>
}

export const ApiService = (pb: PocketBase) => {
  return new Proxy({} as ApiClient, {
    get: (_, prop: keyof ApiClient): ProxyHandler<typeof prop> => {
      type Collection = CollectionResponses[typeof prop]
      return {
        getOne: (id, options) => {
          async function fetcher() {
            return await pb.collection(prop).getOne<Collection>(id, options)
          }
          return createResource(fetcher)
        },
        getList(page, perPage, options) {
          async function fetcher() {
            return await pb
              .collection(prop)
              .getList<Collection>(page, perPage, options)
          }
          return createResource(fetcher)
        },
        create(data, options) {
          async function fetcher() {
            return await pb.collection(prop).create<Collection>(data, options)
          }
          return createResource(fetcher)
        },
        getFullList(options) {
          async function fetcher() {
            return await pb.collection(prop).getFullList<Collection>(options)
          }
          return createResource(fetcher)
        },
        delete(id, options) {
          return pb.collection(prop).delete(id, options)
        }
      }
    }
  })
}

// const api = ApiClient(new PocketBase())
// const [userList] = api.users.getList()

// if (userList.state === 'ready') {

//   userList().items[0].email
// }

// if (userList.state === 'errored') {
//   userList().items[0].email
// }

// const [newUser] = api.users.create({

// })
