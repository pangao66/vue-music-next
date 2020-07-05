<template>
  <div class="scroll-container" ref="wrapper">
    <div class="scroll-content">
      <slot></slot>
    </div>
    <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
  </div>
</template>

<script lang="ts">
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

// const scrollFn = (payload: { x: number; y: number }) => void
BScroll.use(ObserveDOM)
import { defineComponent, onMounted, ref, } from 'vue'

export default defineComponent({
  name: 'scroll',
  props: {
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  // emits: {
  // scroll (payload: { x: number, y: number }) {
  // }
  // },
  setup (props, {emit}) {
    const wrapper = ref('')
    let scroll = null
    onMounted(() => {
      scroll = new BScroll(wrapper.value, {
        observeDOM: true,
        click: true,
        listenScroll: props.listenScroll,
        probeType: 3,
      })
      if (props.listenScroll) {
        scroll.on('scroll', (pos: { x: number, y: number }) => {
          emit('scroll', pos)
        })
      }
    })
    return {
      wrapper
    }
  }
})
</script>

<style scoped>

</style>
