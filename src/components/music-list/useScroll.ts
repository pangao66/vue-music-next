import { ref, watch, Ref, onMounted } from 'vue'

const RESERVED_HEIGHT = 40
type domRef = Ref<HTMLDivElement>

interface useScrollReq {
  // minTranslateY: number
  // imageHeight: number
  layerRef: domRef
  filterRef: domRef
  bgImageRef: domRef
  playBtnRef: domRef
  listRef: Ref
}

export function useScroll ({layerRef, filterRef, bgImageRef, playBtnRef, listRef}: useScrollReq) {
  const scrollY = ref(0)
  let imageHeight = 0
  let minTranslateY = 0

  function scroll (pos: { x: number, y: number }) {
    // console.log(pos)
    scrollY.value = pos.y
  }

  watch(scrollY, (newVal, prevVal) => {
    let translateY = Math.max(minTranslateY, newVal)
    let scale = 1
    let zIndex = 0
    let blur = 0
    const percent = Math.abs(newVal / imageHeight)
    if (newVal > 0) {
      scale = 1 + percent
      zIndex = 10
    } else {
      blur = Math.min(20, percent * 20)
    }
    layerRef.value.style.transform = `translate3d(0,${translateY}px,0)`
    // @ts-ignore
    filterRef.value.style['webkit-backdrop-filter'] = `blur(${blur}px)`
    if (newVal < minTranslateY) {
      zIndex = 10
      bgImageRef.value.style.paddingTop = '0'
      bgImageRef.value.style.height = `${RESERVED_HEIGHT}px`
      playBtnRef.value.style.display = 'none'
    } else {
      bgImageRef.value.style.paddingTop = '70%'
      bgImageRef.value.style.height = '0'
      playBtnRef.value.style.display = ''
    }
    bgImageRef.value.style.transform = `scale(${scale})`
    bgImageRef.value.style.zIndex = `${zIndex}`
  })
  onMounted(() => {
    imageHeight = bgImageRef.value.clientHeight
    minTranslateY = -imageHeight + RESERVED_HEIGHT
    listRef.value.$el.style.top = `${imageHeight}px`
  })
  return {
    scroll
  }
}
