// @ts-nocheck
// import { getLyric, getSongsUrl } from 'api/song'
// import { ERR_OK } from 'api/config'
import { getMusicLyric } from 'api/music'
import { Base64 } from 'js-base64'
import { getSongUrl } from "api/music"

export default class Song {
  public id: string
  public mid: string
  public singer: string
  public name: string
  public album: string
  public duration: number
  public image: string
  public url: string
  public lyric: string

  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }

  async getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    try {
      const {data: {success, data}} = await getMusicLyric(this.mid)
      this.lyric = Base64.decode(data)
      return Promise.resolve(this.lyric)
    } catch (e) {
      return Promise.reject('暂无歌词')
    }
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: musicData?.singer?.[0].name,
    name: musicData.name,
    album: musicData?.album?.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.id && musicData.album.id && (!musicData.pay || musicData.pay.price_album === 0)
}

export async function processSongsUrl (songs: any) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  const mids = songs.map((item) => item.mid)
  const {data: {success, data}} = await getSongUrl({songMids: mids})
  const {midurlinfo} = data?.req_0?.data
  const purlMap = {}
  midurlinfo.forEach((item) => {
    if (item.purl) {
      purlMap[item.songmid] = item.purl
    }
  })
  songs = songs.filter((song) => {
    const purl = purlMap[song.mid]
    if (purl) {
      song.url = purl.indexOf('https') === -1 ? `https://dl.stream.qqmusic.qq.com/${purl}` : purl
      return true
    }
    return false
  })
  return songs
}
