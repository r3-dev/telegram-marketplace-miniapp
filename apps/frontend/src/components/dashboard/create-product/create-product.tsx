import { TextField } from '@kobalte/core'
import { createSignal } from 'solid-js'

import './create-product.css'

export function CreateProductPage() {
  const [productName, setProductName] = createSignal('')
  const [productDescription, setProductDescription] = createSignal('')
  const [productPrice, setProductPrice] = createSignal('')

  return (
    <div class="create-store__form">
      <TextField.Root
        required
        class="text-field"
      >
        <TextField.Label class="text-field__label">Название</TextField.Label>
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
        <TextField.Label class="text-field__label">Описание</TextField.Label>
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
        <TextField.Label class="text-field__label">Цена</TextField.Label>
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
