import { computed, ComputedRef, Ref, ref, watch, reactive } from 'vue'
import { PlayStoreInt } from "@/types/playStore"
import { playMode } from "common/js/config"
import Song from "common/js/song"
import Lyric from 'lyric-parser'

export function usePlay (audio: Ref<HTMLAudioElement>, state: PlayStoreInt, currentSong: ComputedRef<Song>, songReady: Ref<boolean>) {
  // const currentLyric = ref({} as Lyric)
  watch(() => currentSong.value, async (newSong, oldSong) => {
    if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
      return
    }
    try {
      audio.value.src = newSong.url
      await audio.value.play()
    } catch (e) {
      console.log(e)
    }
  })
  watch((() => state.playing), (newPlaying) => {
    newPlaying ? audio.value.play() : audio.value.pause()
  })
  const playIcon = computed(() => {
    return state.playing ? 'icon-pause' : 'icon-play'
  })
  const miniPlayIcon = computed(() => {
    return state.playing ? 'icon-pause-mini' : 'icon-play-mini'
  })
  const cdCls = computed(() => {
    return state.playing ? 'play' : ''
  })
  const disableCls = computed(() => {
    return songReady.value ? '' : 'disable'
  })
  const iconMode = computed(() => {
    const map = {
      [playMode.sequence]: 'icon-sequence',
      [playMode.loop]: 'icon-loop',
      [playMode.random]: 'icon-random'
    }
    return map[state.mode]
  })
  return {
    // togglePlay,
    playIcon,
    miniPlayIcon,
    cdCls,
    disableCls,
    iconMode,
    // getLyric
  }
}

export function useReady (songReady: Ref<boolean>) {
  function ready () {
    songReady.value = true
  }

  function error () {
    songReady.value = false
  }

  return {
    songReady,
    ready,
    error
  }
}

export function useTime () {
  const currentTime = ref(0)

  function updateTime (e: Event) {
    const target = e.target as HTMLAudioElement
    currentTime.value = target.currentTime
  }

  function formatTime (interval: number) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = interval % 60
    return `${minute}:${second.toString().padStart(2, '0')}`
  }

  return {
    currentTime,
    updateTime,
    formatTime
  }
}

// interface LyricStateInt {
//   currentLyric: Lyric
//   currentLineNum: number
// }

export function useLyric (currentSong: ComputedRef<Song>, state: PlayStoreInt) {
  const lyricState = reactive({
    currentLyric: null as null | Lyric,
    currentLineNum: 0,
    playingLyric: ''
  })
  const lyricListRef = ref('' as any)
  const lyricLineRef = ref([] as unknown as HTMLParagraphElement[])
  const handleLyric = ({lineNum, txt}: { lineNum: number, txt: string }) => {
    lyricState.currentLineNum = lineNum
    if (lineNum > 5) {
      let lineEl = lyricLineRef.value[lineNum - 5]
      // @ts-ignore
      lyricListRef.value.scrollToElement(lineEl, 1000)
    } else {
      lyricListRef.value.scrollTo(0, 0, 1000)
    }
    lyricState.playingLyric = txt

  }
  watch(() => currentSong.value, async (newSong, oldSong) => {
    if (newSong.id === oldSong.id) {
      return
    }
    if (lyricState.currentLyric) {
      lyricState.currentLyric.stop()
    }
    try {
      const lyric = await currentSong.value.getLyric()
      lyricState.currentLyric = new Lyric(lyric, handleLyric)
      if (state.playing) {
        lyricState.currentLyric.play(0)
      }
    } catch (e) {
      lyricState.currentLyric = null
      lyricState.currentLineNum = 0
      lyricState.playingLyric = ''
    }
  })
  return {
    lyricState,
    lyricListRef,
    lyricLineRef,
  }
}

interface Touch {
  initiated: boolean
  startX: number
  startY: number
  left: number
  percent: number
}

export function useShow (lyricListRef: Ref<any>) {
  const currentShow = ref('cd')
  const touchState = {} as Touch
  const middleLeftRef = ref('' as unknown as HTMLDivElement)
  const middleTouchStart = (e: TouchEvent) => {
    touchState.initiated = true
    touchState.startX = e.touches[0].pageX
    touchState.startY = e.touches[0].pageY
  }
  const middleTouchMove = (e: TouchEvent) => {
    if (!touchState.initiated) {
      return
    }
    const touch = e.touches[0]
    const deltaX = touch.pageX - touchState.startX
    const deltaY = touch.pageY - touchState.startY
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return
    }
    const left = currentShow.value === 'cd' ? 0 : -window.innerWidth
    const width = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
    touchState.percent = Math.abs(width / window.innerWidth)
    lyricListRef.value.$el.style.transform = `translate3d(${width}px,0,0)`
    lyricListRef.value.$el.style.transitionDuration = 0
    middleLeftRef.value.style.opacity = `${1 - touchState.percent}`

  }
  const middleTouchEnd = () => {
    let offsetWidth: number
    let opacity: number
    if (currentShow.value === 'cd') {
      if (touchState.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        currentShow.value = 'lyric'
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      if (touchState.percent < 0.9) {
        offsetWidth = 0
        currentShow.value = 'cd'
        opacity = 1
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }
    lyricListRef.value.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
    lyricListRef.value.$el.style.transitionDuration = '300ms'
    middleLeftRef.value.style.opacity = `${opacity}`
  }
  return {
    currentShow,
    middleTouchStart,
    middleTouchMove,
    middleTouchEnd,
    middleLeftRef
  }
}
