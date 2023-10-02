import lottie from 'lottie-web'
import { createEffect, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'

interface LottieAnimationProps {
  animationData: string
  loop?: boolean
  autoplay?: boolean
}

export const LottieAnimation: Component<LottieAnimationProps> = (props) => {
  let containerRef!: HTMLDivElement

  createEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef,
      renderer: 'svg',
      loop: props.loop || false,
      autoplay: props.autoplay || false,
      path: props.animationData
    })

    onCleanup(() => {
      anim.destroy()
    })
  })

  return (
    <div
      style={{ width: '128px', height: '128px' }}
      ref={containerRef}
    ></div>
  )
}
