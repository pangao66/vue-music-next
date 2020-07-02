import axios from './index'
import { SingerItemInt } from "@/types/singer"

export const getHotSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getHotSingerList')
export const getCommonSingerApi = () => axios.get<SingerItemInt[]>('/api/music/getSingerList')
export const getSingerSongApi = (params: { id: string }) => axios.get('/api/music/getSingerDetail', {params})
