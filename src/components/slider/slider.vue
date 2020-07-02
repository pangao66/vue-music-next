<template>
  <div class="slider" ref="sliderWrapper">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in 9"
            :key="index"></span>
    </div>
  </div>
</template>

<script lang="ts">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import ObserveDOM from '@better-scroll/observe-dom'
import { defineComponent, ref, onMounted, nextTick, onUnmounted } from 'vue'

BScroll.use(Slide)
BScroll.use(ObserveDOM)
export default defineComponent({
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  setup (props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let slide = null as unknown as Slide | BScroll
    const currentPageIndex = ref(0)
    let playTimer: any = null
    const root = ref(null)
    const sliderWrapper = ref(null as unknown as HTMLDivElement)

    function nextPage () {
      slide.next()
    }

    function autoGoNext () {
      clearTimeout(playTimer)
      playTimer = setTimeout(() => {
        nextPage()
      }, 4000)
    }

    function _onScrollEnd () {
      autoGoNext()
    }

    function init () {
      clearTimeout(playTimer)
      slide = new BScroll(sliderWrapper.value, {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: props.loop,
          threshold: 100
        },
        useTransition: true,
        momentum: false,
        bounce: false,
        stopPropagation: true,
        probeType: 2,
        click: true,
        observeDOM: true
      })
      slide.on('scrollEnd', _onScrollEnd)
      slide.on('beforeScrollStart', () => {
        clearTimeout(playTimer)
      })
      // user touched the slide done
      slide.on('scrollEnd', () => {
        autoGoNext()
      })
      slide.on('slideWillChange', (page: { pageX: number, pageY: number }) => {
        currentPageIndex.value = page.pageX
      })
      autoGoNext()
    }

    function prePage () {
      slide.prev()
    }

    onMounted(async () => {
      await nextTick()
      init()
      // console.log(slideDiv.value)
    })
    onUnmounted(() => {
      clearTimeout(playTimer)
      slide.destroy()
    })
    return {
      currentPageIndex,
      playTimer,
      nextPage,
      prePage,
      sliderWrapper
    }
  }
})
</script>

<style lang="stylus">
  .slider
    min-height: 1px
    width: 100%;
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      width: 100%;
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        width: 100%
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
