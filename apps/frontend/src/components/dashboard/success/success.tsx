import { useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { onCleanup, onMount } from 'solid-js'
import type { Component } from 'solid-js'

import { LottieAnimation } from '../../lottie-animation'

interface SuccessProps {
  text: string
  nextButtonLink: string
}

export const Success: Component<SuccessProps> = (props) => {
  const sdk = useSDK()
  const navigate = useNavigate()

  function goToNext() {
    navigate(props.nextButtonLink)
  }

  onMount(() => {
    sdk.mainButton().setText('Далее').show()
    sdk.mainButton().on('click', goToNext)
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
      nextButtonLink="/"
      text="Мы почти закончили, остался последний шаг!"
    />
  )
}
