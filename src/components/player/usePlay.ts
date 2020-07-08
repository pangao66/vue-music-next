import { computed, ComputedRef, Ref, ref, watch, reactive, onBeforeUpdate } from 'vue'
import { PlayStoreInt } from "@/types/playStore"
import { playMode } from "common/js/config"
import { getMusicLyric } from "api/music"
import Song from "common/js/song"
import Lyric from 'lyric-parser'

export function usePlay (audio: Ref<HTMLAudioElement>, state: PlayStoreInt, currentSong: ComputedRef<Song>, songReady: Ref<boolean>) {
  const currentLyric = ref({} as Lyric)
  watch(() => currentSong.value, async (newSong, oldSong) => {
    if (newSong.id === oldSong.id) {
      return
    }
    audio.value.play().then()
    const lyric = await currentSong.value.getLyric()
    // @ts-ignore
    currentLyric.value = new Lyric(lyric)
    console.log(currentLyric.value)
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

  async function getLyric () {
    const res = await currentSong.value.getLyric()
    console.log(res)
  }

  return {
    // togglePlay,
    playIcon,
    miniPlayIcon,
    cdCls,
    disableCls,
    iconMode,
    getLyric
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

export function useLyric (currentSong: ComputedRef<Song>, state: PlayStoreInt) {
  const lyricState = reactive({
    currentLyric: {} as Lyric,
    currentLineNum: 0
  })
  const lyricListRef = ref('' as any)
  const lyricLineRef = ref([] as unknown as HTMLDivElement[])
  const handleLyric = ({lineNum, txt}: { lineNum: number, txt: string }) => {
    lyricState.currentLineNum = lineNum
    if (lineNum > 5) {
      let lineEl = lyricLineRef.value[lineNum - 5]
      // @ts-ignore
      lyricListRef.value.scrollToElement(lineEl, 1000)
    } else {

    }
  }
  watch(() => currentSong.value, async (newSong, oldSong) => {
    if (newSong.id === oldSong.id) {
      return
    }
    const lyric = await currentSong.value.getLyric()
    lyricState.currentLyric = new Lyric(lyric, handleLyric)
    if (state.playing) {
      lyricState.currentLyric.play(0)
    }
  })
  // 确保在每次变更之前重置引用
  onBeforeUpdate(() => {
    lyricLineRef.value = []
  })
  return {
    lyricState,
    lyricListRef
  }
}
