import PocketBase, {
  ListResult,
  RecordOptions,
  RecordService
} from 'pocketbase'
import { createResource, ResourceReturn } from 'solid-js'

import { CollectionRecords, CollectionResponses } from '@/types/pb-types'

type ProxyHandlerMap = {
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
}

export const ApiClient = (pb: PocketBase) => {
  return new Proxy({} as ProxyHandlerMap, {
    get: (_, prop: keyof ProxyHandlerMap): ProxyHandler<typeof prop> => {
      type Collection = CollectionResponses[typeof prop]
      return {
        getOne: (id, options) => {
          async function fetcher() {
            return await pb.collection(prop).getOne<Collection>(id, options)
          }
          return createResource<Collection>(fetcher)
        },
        getList(page, perPage, options) {
          async function fetcher() {
            return await pb
              .collection(prop)
              .getList<Collection>(page, perPage, options)
          }
          return createResource<ListResult<Collection>>(fetcher)
        },
        create(data, options) {
          async function fetcher() {
            return await pb.collection(prop).create<Collection>(data, options)
          }
          return createResource<Collection>(fetcher)
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
