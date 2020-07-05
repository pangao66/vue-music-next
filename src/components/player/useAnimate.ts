import animations from 'create-keyframe-animation'
import { ref } from 'vue'

const cdWrapper = ref('' as unknown as HTMLDivElement)

function enter (el: HTMLElement, done: HTMLElementEventMap) {
  const {x, y, scale} = getPosAndSc()
  let animation = {
    0: {
      transform: `translate3d(${x}px, ${y}px,0) scale${scale}`
    },
    60: {
      transform: `translate3d(0,0,0) scale(1.1)`
    },
    100: {
      transform: `translate3d(0,0,0) scale(1)`
    },

  }
  animations.registerAnimation({
    name: 'move',
    animation,
    presets: {
      duration: 400,
      easing: 'linear'
    }
  })
  animations.runAnimation(cdWrapper.value, 'move', done)
}

function afterEnter () {
  animations.unregisterAnimation('move')
  cdWrapper.value.style.animation = ''
}

function leave (el: HTMLElement, done: any) {
  const {x, y, scale} = getPosAndSc()
  cdWrapper.value.style.transition = 'all 0.4s'
  cdWrapper.value.style.transform = ` translate3d(${x}px,${y}px,0) scale(${scale})`
  cdWrapper.value.addEventListener('transitionend', done)
}

function afterLeave () {
  cdWrapper.value.style.transition = ''
}

function getPosAndSc () {
  const targetWidth = 40
  const paddingLeft = 40
  const paddingBottom = 30
  const paddingTop = 80
  const width = window.innerWidth * 0.8
  const scale = targetWidth / width
  const x = -(window.innerWidth / 2) - paddingLeft
  const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
  return {
    x, y, scale
  }
}

export default function useAnimate () {
  return {
    enter,
    afterEnter,
    leave,
    afterLeave,
    cdWrapper
  }
}
