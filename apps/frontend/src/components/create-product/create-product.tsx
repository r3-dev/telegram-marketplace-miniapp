import { TextField } from '@kobalte/core'
import { createSignal } from 'solid-js'

import './create-product.css'

import { StoresResponse } from '@/types/pb-types'

export interface CreateProductProps {
  store?: StoresResponse
}

export function CreateProduct(props: CreateProductProps) {
  const [productName, setProductName] = createSignal('')
  const [productDescription, setProductDescription] = createSignal('')
  const [productPrice, setProductPrice] = createSignal('')

  return (
    <div class="create-store__form">
      <h1 class="text-xl">
        Add new product to store
        <span class="text-tg-link font-bold"> {props.store?.name}</span>
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
