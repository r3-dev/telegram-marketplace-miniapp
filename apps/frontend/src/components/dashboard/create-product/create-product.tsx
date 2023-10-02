import { TextField } from '@kobalte/core'
import { useSDK } from '@tma.js/sdk-solid'
import { createSignal, onCleanup, onMount } from 'solid-js'

import './create-product.css'

import { useNavigate } from '@solidjs/router'

export function CreateProductPage() {
  const { mainButton, backButton } = useSDK()
  const [productName, setProductName] = createSignal('')
  const [productDescription, setProductDescription] = createSignal('')
  const [productPrice, setProductPrice] = createSignal('')

  const navigate = useNavigate()

  function goToNext() {
    mainButton().disable()

    navigate('/dashboard/products-list')
  }

  function onBack() {
    navigate('/dashboard/create-store')
  }

  onMount(() => {
    mainButton().setText('Next')

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
