<template>
  <div class="scroll-container" ref="wrapper">
    <div class="scroll-content">
      <slot></slot>
    </div>
    <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'scroll',
  setup () {
    const wrapper = ref('')
    let scroll = null
    onMounted(() => {
      // let wrapper = document.querySelector('.wrapper')
      scroll = new BScroll(wrapper.value, {
        observeDOM: true,
        click: true
      })
    })
    return {
      wrapper
    }
  }
})
</script>

<style scoped>

</style>
