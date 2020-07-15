import { useStorage } from '@/hooks/useStorage'
import { provide, inject } from 'vue'
import Song from "common/js/song"

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

const searchHistory = useStorage(SEARCH_KEY, [] as string[])
const songs = useStorage(PLAY_KEY, [] as Song[])
const saveSearch = (query: string) => {
  insertArray(searchHistory.value, query, (item: string) => {
    return item === query
  }, SEARCH_MAX_LEN)
}

export function deleteSearch (query: string) {
  deleteFromArray(searchHistory.value, (item: string) => {
    return item === query
  })
}

export function clearSearch () {
  searchHistory.value = []
}

export function savePlay (song: Song) {
  insertArray(songs.value, song, (item: Song) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  return songs
}

// export function saveFavorite (song) {
//   let songs = storage.get(FAVORITE_KEY, [])
//   insertArray(songs, song, (item) => {
//     return song.id === item.id
//   }, FAVORITE_MAX_LEN)
//   storage.set(FAVORITE_KEY, songs)
//   return songs
// }


function insertArray (arr: any[], val: any, compare: any, maxLen: number) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export const storageSymbol = Symbol()
export const useStorageProvide = () => {
  provide(storageSymbol, {
    searchHistory,
    saveSearch,
    deleteSearch,
    clearSearch
  })
}

interface StorageContext {
  searchHistory: any[]
  saveSearch: (query: string) => void
  deleteSearch: (query: string) => void
  clearSearch: () => void
}

export const useStorageInject = function () {

  const storageContext = inject<StorageContext>(storageSymbol)
  if (!storageContext) {
    throw new Error(`useStorageInject must be used after useStorageProvide`)
  }
  return storageContext

}

function deleteFromArray (arr: any[], compare: any) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
