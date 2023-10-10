import { TextField } from '@kobalte/core'
import { useNavigate, useParams } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

import { CreateProduct } from '@/components/create-product/create-product'
import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, ProductsRecord, StoresResponse } from '@/types/pb-types'

export function CreateProductPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { mainButton, backButton } = useSDK()
  const pb = usePocketBase()
  const [store, setStore] = createSignal<StoresResponse>()

  console.log(params)
  console.log()

  async function goToNext() {
    mainButton().disable()

    const newProduct: ProductsRecord = {
      name: productName(),
      description: productDescription(),
      price: parseFloat(productPrice()),
      store: params.storeId
    }

    await pb
      .collection(Collections.Products)
      .create<ProductsRecord>(newProduct)
      .catch((err) => {
        console.error(err)
      })

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

  const [productName, setProductName] = createSignal('')
  const [productDescription, setProductDescription] = createSignal('')
  const [productPrice, setProductPrice] = createSignal('')

  return (
    <div class="create-store__form">
      <h1 class="text-xl">
        Add new product to store
        <span class="text-tg-link font-bold"> {store()?.name}</span>
      </h1>
      <TextField.Root
        required
        class="text-field"
      >
        <TextField.Label class="text-field__label">Title</TextField.Label>
        <TextField.Input
          class="text-field__input"
          value={productName()}
          autocomplete="off"
          onChange={(e) => setProductName(e.currentTarget.value)}
        />
      </TextField.Root>

      <TextField.Root
        required
        class="text-field"
      >
        <TextField.Label class="text-field__label">Description</TextField.Label>
        <TextField.TextArea
          autoResize
          class="text-field__input"
          value={productDescription()}
          onChange={(e) => setProductDescription(e.currentTarget.value)}
        />
      </TextField.Root>

      <TextField.Root
        required
        class="text-field"
      >
        <TextField.Label class="text-field__label">Price</TextField.Label>
        <TextField.Input
          class="text-field__input"
          placeholder="$1000.00"
          value={productPrice()}
          onChange={(e) => setProductPrice(e.currentTarget.value)}
        />
      </TextField.Root>
    </div>
  )
}
