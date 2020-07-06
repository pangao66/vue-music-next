import axios from './index'
import { SingerItemInt, SingerSongInt } from "@/types/singer"

export const getHotSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getHotSingerList')
export const getCommonSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getSingerList')
export const getSingerSongApi = (params: { id: string }) => axios.get<SingerSongInt>('/api/music/getSingerDetail', {params})
export const getSongUrl = ({songMids}: { songMids: string[] }) => axios.post('/api/music/getSongUrl', {songMids})
