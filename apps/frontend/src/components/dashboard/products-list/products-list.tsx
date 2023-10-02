import { useNavigate } from '@solidjs/router'

import './products-list.css'

import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'

export function ProductsListPage() {
  const { mainButton, backButton } = useSDK()
  const navigate = useNavigate()

  function goToNext() {
    navigate('/dashboard/success')
  }

  function onBack() {
    navigate('/dashboard/product-list')
  }

  onMount(() => {
    mainButton().setText('Next')

    mainButton().on('click', goToNext)
    backButton().on('click', onBack)

    if (!mainButton().isVisible) mainButton().show()
    if (!backButton().isVisible) backButton().show()
  })

  onCleanup(() => {
    mainButton().off('click', goToNext)
    backButton().off('click', onBack)
  })
  return <div>PRODUCT LIST</div>
}
