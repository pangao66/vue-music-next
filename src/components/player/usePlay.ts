// import { usePlayerInject } from '../../store/player'
import { ref, watch, computed, Ref, ComputedRef } from 'vue'
import { PlayerContext } from "@/store/player"
import { PlayStoreInt } from "@/types/playStore"

export function usePlay (audio: Ref<HTMLAudioElement>, state: PlayStoreInt, currentSong: ComputedRef<any>, songReady: Ref<boolean>) {
  // function togglePlay () {
  //   setPlayingState(!state.playing)
  // }
  watch(() => currentSong.value, () => {
    console.log(audio.value)
    audio.value.play().then()
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
  return {
    // togglePlay,
    playIcon,
    miniPlayIcon,
    cdCls,
    disableCls
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
