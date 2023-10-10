import { useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'

import { Welcome } from '@/components/welcome/welcome'

export function DashboardPage() {
  const sdk = useSDK()
  const navigate = useNavigate()

  onMount(() => {
    sdk.mainButton().on('click', handleCreateStore)
    sdk.mainButton().setText('Create store')

    if (!sdk.mainButton().isVisible) sdk.mainButton().show()
    if (sdk.backButton().isVisible) sdk.backButton().hide()

    if (!sdk.mainButton().isEnabled) sdk.mainButton().enable()
  })

  onCleanup(() => {
    sdk.mainButton().off('click', handleCreateStore)
  })

  function handleCreateStore() {
    sdk.mainButton().disable()

    navigate('/dashboard/store/create')
  }
  return <Welcome />
}
