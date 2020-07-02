export interface SingerItemInt {
  area_id: number
  concernNum: number
  country: string
  country_id: number
  other_name: string
  singer_id: number
  singer_mid: string
  singer_name: string
  singer_pmid: string
  spell: string
  trend: number
}

export interface SingerSongInt {
  singerMid: string
  totalNum: number
}

interface Interface {
  songInfo: {
    mid: string
  }
}
