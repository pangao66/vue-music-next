import { computed, ComputedRef, inject, provide, reactive } from 'vue'
import { playMode } from 'common/js/config'
import Singer from "common/js/singer"
import { shuffle } from "common/js/util"
import Song from "common/js/song"


export type PlayerContext = {
  state: {
    singer: Singer
    playing: boolean
    fullScreen: boolean
    playlist: Song[]
    sequenceList: Song[]
    mode: playMode
    currentIndex: number
  }
  currentSong: ComputedRef<Song>
  setSinger: (singer: Singer) => void
  setFullScreen: (flag: boolean) => void
  setPlayingState: (flag: boolean) => void
  setPlayList: (list: Song[]) => void
  setSequenceList: (list: Song[]) => void
  setPlayMode: (mode: playMode) => void
  setCurrentIndex: (index: number) => void
  selectPlay: ({list, index}: { index: number, list: any[] }) => void
  randomPlay: (list: Song[]) => void
  insertSong: (song: Song) => void
}

function findIndex (list: Song[], song: Song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

const state = reactive({
  singer: {} as Singer,
  playing: false,
  fullScreen: false,
  playlist: [] as Song[],
  sequenceList: [] as Song[],
  mode: playMode.sequence,
  currentIndex: -1
})
const currentSong = computed<Song>(() => {
  return state.playlist[state.currentIndex] || {} as Song
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

function setPlayList (list: Song[]) {
  state.playlist = list
}

function setSequenceList (list: Song[]) {
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
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    setPlayList(randomList)
    index = findIndex(randomList, list[index])
  } else {
    setPlayList(list)
  }
  setPlayList(list)
  setCurrentIndex(index)
  setFullScreen(true)
  setPlayingState(true)
}

function randomPlay (list: Song[]) {
  setPlayMode(playMode.random)
  setSequenceList(list)
  let randomList = shuffle(list)
  setPlayList(randomList)
  setCurrentIndex(0)
  setFullScreen(true)
  setPlayingState(true)
}

function insertSong (song: Song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  setPlayList(playlist)
  setSequenceList(sequenceList)
  setCurrentIndex(currentIndex)
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
    setPlayingState,
    randomPlay,
    insertSong
  })
}
export const usePlayerInject = function () {

  const playerContext = inject<PlayerContext>(playerSymbol)
  if (!playerContext) {
    throw new Error(`playerContextInject must be used after playerContextProvide`)
  }
  return playerContext

}
