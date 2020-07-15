// import storage from 'good-storage'
// import Song from "common/js/song"
// import { watchEffect, ref, reactive, Ref, ReactiveEffect } from 'vue'
//
// const SEARCH_KEY = '__search__'
// const SEARCH_MAX_LEN = 15
//
// const PLAY_KEY = '__play__'
// const PLAY_MAX_LEN = 200
//
// const FAVORITE_KEY = '__favorite__'
// const FAVORITE_MAX_LEN = 200
//
// // function insertArray (arr: any[], val: any, compare: any, maxLen: number) {
// //   const index = arr.findIndex(compare)
// //   if (index === 0) {
// //     return
// //   }
// //   if (index > 0) {
// //     arr.splice(index, 1)
// //   }
// //   arr.unshift(val)
// //   if (maxLen && arr.length > maxLen) {
// //     arr.pop()
// //   }
// // }
//
// function deleteFromArray (arr: any[], compare: any) {
//   const index = arr.findIndex(compare)
//   if (index > -1) {
//     arr.splice(index, 1)
//   }
// }
//
// export function saveSearch (query: string) {
//   let searches = storage.get(SEARCH_KEY, [])
//   insertArray(searches, query, (item: string) => {
//     return item === query
//   }, SEARCH_MAX_LEN)
//   storage.set(SEARCH_KEY, searches)
//   return searches
// }
//
// export function deleteSearch (query: string) {
//   let searches = storage.get(SEARCH_KEY, [])
//   deleteFromArray(searches, (item: string) => {
//     return item === query
//   })
//   storage.set(SEARCH_KEY, searches)
//   return searches
// }
//
// export function clearSearch () {
//   storage.remove(SEARCH_KEY)
//   return []
// }
//
// export function loadSearch () {
//   return storage.get(SEARCH_KEY, [])
// }
//
// export function savePlay (song: Song) {
//   let songs = storage.get(PLAY_KEY, [])
//   insertArray(songs, song, (item: Song) => {
//     return song.id === item.id
//   }, PLAY_MAX_LEN)
//   storage.set(PLAY_KEY, songs)
//   return songs
// }
//
// export function loadPlay () {
//   return storage.get(PLAY_KEY, [])
// }
//
// export function saveFavorite (song: Song) {
//   let songs = storage.get(FAVORITE_KEY, [])
//   insertArray(songs, song, (item: Song) => {
//     return song.id === item.id
//   }, FAVORITE_MAX_LEN)
//   storage.set(FAVORITE_KEY, songs)
//   return songs
// }
//
// export function deleteFavorite (song: Song) {
//   let songs = storage.get(FAVORITE_KEY, [])
//   deleteFromArray(songs, (item: Song) => {
//     return item.id === song.id
//   })
//   storage.set(FAVORITE_KEY, songs)
//   return songs
// }
//
// export function loadFavorite () {
//   return storage.get(FAVORITE_KEY, [])
// }
//
// export default function useStorage<T> (key: string, value: T): Ref<T> | ReactiveEffect<T> {
//   const type = typeof value
//   let data
//   if (typeof value === 'string') {
//     // @ts-ignore
//     data = reactive({...value})
//   } else {
//     data = ref(value)
//   }
//   watchEffect(() => {
//     if (type !== 'object') {
//       // @ts-ignore
//       localStorage[key] = value.toString()
//     } else {
//       localStorage[key] = JSON.stringify(value)
//     }
//   })
//   // @ts-ignore
//   return data.value ? data.value : data
// }
