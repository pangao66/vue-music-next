import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { PlayStoreInt } from "@/types/playStore"
import { playMode } from "common/js/config"

export function usePlay (audio: Ref<HTMLAudioElement>, state: PlayStoreInt, currentSong: ComputedRef<any>, songReady: Ref<boolean>) {
  watch(() => currentSong.value, (newSong, oldSong) => {
    if (newSong.id === oldSong.id) {
      return
    }
    audio.value.play().then()
    getLyric().then(r => {
    })
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

function useLyric () {
  const currentLyric = ref('')
}
