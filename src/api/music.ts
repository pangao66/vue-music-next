import axios from './index'
import { SingerItemInt, SingerSongInt } from "@/types/singer"
import { HotKeyData, SearchResultInt } from "api/types"

export const getHotSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getHotSingerList')
export const getCommonSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getSingerList')
export const getSingerSongApi = (params: { id: string }) => axios.get<SingerSongInt>('/api/music/getSingerDetail', {params})
export const getSongUrl = ({songMids}: { songMids: string[] }) => axios.post('/api/music/getSongUrl', {songMids})
export const getMusicLyric = (id: string) => axios.get<string>('/api/music/getLyric', {
  params: {
    id
  }
})
export const getHotkey = () => axios.get<HotKeyData>('/api/music/getHotKey')
export const searchMusic = (keywords: string) => axios.get<SearchResultInt>('/api/music/search', {params: {keywords}})
