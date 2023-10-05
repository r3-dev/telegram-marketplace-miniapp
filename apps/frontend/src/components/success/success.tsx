import { useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'
import type { Component } from 'solid-js'

import { LottieAnimation } from '../lottie-animation'

interface SuccessProps {
  text: string
  nextButtonLink: string
  nextButtonText: string
}

export const Success: Component<SuccessProps> = (props) => {
  const sdk = useSDK()
  const navigate = useNavigate()

  function goToNext() {
    sdk.mainButton().disable()

    navigate(props.nextButtonLink)
  }

  onMount(() => {
    sdk.mainButton().on('click', goToNext)
    sdk.mainButton().setText(props.nextButtonText)

    if (!sdk.mainButton().isVisible) sdk.mainButton().show()
    if (sdk.backButton().isVisible) sdk.backButton().hide()

    if (!sdk.mainButton().isEnabled) sdk.mainButton().enable()
  })

  onCleanup(() => {
    sdk.mainButton().off('click', goToNext)
  })

  return (
    <div class="flex flex-col justify-center items-center">
      <LottieAnimation
        animationData="/lottie/check_mark.json"
        autoplay
        loop={false}
      />
      <p class="text-center">{props.text}</p>
    </div>
  )
}

export function SuccessMock() {
  return (
    <Success
      nextButtonLink="/dashboard"
      nextButtonText="На главную"
      text="Поздравляем! Ваш магазин успешно создан!"
    />
  )
}
