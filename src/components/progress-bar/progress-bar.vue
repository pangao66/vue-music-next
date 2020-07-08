<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="{width:`${offsetWidth}px`}"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           :style="{transform:`translate3d(${offsetWidth}px,0,0)`}"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch, nextTick } from 'vue'

interface Touch {
  initiated: boolean
  startX: number
  left: number
}

const progressBtnWidth = 16
export default defineComponent({
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  setup (props, {emit}) {
    const progressBar = ref('' as unknown as HTMLDivElement)
    const progress = ref('' as unknown as HTMLDivElement)
    const progressBtn = ref('' as unknown as HTMLDivElement)
    const barPercent = ref(0)
    watch((() => props.percent), (newPercent) => {
      if (touch.initiated) {
        return
      }
      if (newPercent > 0) {
        barPercent.value = newPercent
      }
    })
    const offsetWidth = computed({
      get: () => {
        const barWidth = progressBar.value.clientWidth - progressBtnWidth
        return barWidth * barPercent.value
      },
      set: (val) => {
        const barWidth = progressBar.value.clientWidth - progressBtnWidth
        const percent = val / barWidth
        barPercent.value = percent
      }
    })
    const touch = reactive({} as Touch)

    function progressTouchStart (e: TouchEvent) {
      touch.initiated = true
      touch.startX = e.touches[0].pageX
      touch.left = progress.value.clientWidth
    }

    function progressTouchMove (e: TouchEvent) {
      if (!touch.initiated) {
        return
      }
      // 手指移动的偏移量
      const deltaX = e.touches[0].pageX - touch.startX
      offsetWidth.value = Math.min(progressBar.value.clientWidth - progressBtnWidth, Math.max(0, touch.left + deltaX))
    }

    function progressTouchEnd (e: TouchEvent) {
      touch.initiated = false
      triggerPercent()
    }

    function triggerPercent () {
      const barWidth = progressBar.value.clientWidth - progressBtnWidth
      const percent = progress.value.clientWidth / barWidth
      emit('percent-change', percent)
    }

    function progressClick (e: MouseEvent) {
      touch.initiated = true
      const rect = progressBar.value.getBoundingClientRect()
      offsetWidth.value = e.pageX - rect.left
      nextTick(() => {
        triggerPercent()
        touch.initiated = false
      })
    }

    return {
      progressBar,
      progress,
      progressBtn,
      offsetWidth,
      progressTouchStart,
      progressTouchMove,
      progressTouchEnd,
      progressClick
    }
  }
})
</script>

<style scoped lang="stylus">
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
