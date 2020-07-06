import { reactive, ref, computed, provide, inject, ComputedRef } from 'vue'
import { playMode } from 'common/js/config'
import Singer from "common/js/singer"
import singer from "views/singer/singer.vue"


export type PlayerContext = {
  state: {
    singer: Singer
    playing: boolean
    fullScreen: boolean
    playlist: any[]
    sequenceList: any[]
    mode: playMode
    currentIndex: number
  }
  currentSong: ComputedRef<any>
  setSinger: (singer: Singer) => void
  setFullScreen: (flag: boolean) => void
  setPlayingState: (flag: boolean) => void
  setPlayList: (list: any) => void
  setSequenceList: (list: any) => void
  setPlayMode: (mode: playMode) => void
  setCurrentIndex: (index: number) => void
  selectPlay: ({list, index}: { index: number, list: any[] }) => void
}
const state = reactive({
  singer: {} as Singer,
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
})
const currentSong = computed(() => {
  return state.playlist[state.currentIndex] || {}
})

function setSinger (singer: Singer) {
  state.singer = singer
}

function setFullScreen (flag: boolean) {
  state.fullScreen = flag
}

function setPlayingState (flag: boolean) {
  state.playing = flag
}

function setPlayList (list: any) {
  state.playlist = list
}

function setSequenceList (list: any) {
  state.sequenceList = list
}

function setPlayMode (mode: playMode) {
  state.mode = mode
}

function setCurrentIndex (currentIndex: number) {
  state.currentIndex = currentIndex
}

function selectPlay ({list, index}: { index: number, list: any[] }) {
  setSequenceList(list)
  setPlayList(list)
  setCurrentIndex(index)
  setFullScreen(true)
  setPlayingState(true)
}

export const playerSymbol = Symbol()
export const usePlayerStore = function () {
  provide(playerSymbol, {
    state,
    currentSong,
    setSinger,
    setFullScreen,
    setPlayList,
    setSequenceList,
    setPlayMode,
    setCurrentIndex,
    selectPlay,
    setPlayingState
  })
}
export const usePlayerInject = function () {

  const playerContext = inject<PlayerContext>(playerSymbol)
  if (!playerContext) {
    throw new Error(`playerContextInject must be used after playerContextProvide`)
  }
  return playerContext

}
