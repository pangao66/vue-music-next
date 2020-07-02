// @ts-nocheck
// import { getLyric, getSongsUrl } from 'api/song'
// import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
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

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      // getLyric(this.mid).then((res) => {
      //   if (res.retcode === ERR_OK) {
      //     this.lyric = Base64.decode(res.lyric)
      //     resolve(this.lyric)
      //   } else {
      //     reject(new Error('no lyric'))
      //   }
      // })
    })
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

export function processSongsUrl (songs: any) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  // return getSongsUrl(songs).then((purlMap) => {
  //   songs = songs.filter((song) => {
  //     const purl = purlMap[song.mid]
  //     if (purl) {
  //       song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
  //       return true
  //     }
  //     return false
  //   })
  //   return songs
  // })
}
