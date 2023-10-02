import { useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'

import { usePocketBase } from '../../../contexts/pocketbase'

import './create-product.css'

export function CreateProductPage() {
  const { mainButton, backButton } = useSDK()
  const pb = usePocketBase()
  const navigate = useNavigate()

  function onBack() {
    navigate('/create-store')
  }

  onMount(() => {
    backButton().on('click', onBack)

    if (!backButton().isVisible) backButton().show()
    if (mainButton().isVisible) mainButton().hide()
  })

  onCleanup(() => {
    backButton().off('click', onBack)
  })

  return <div></div>
}
