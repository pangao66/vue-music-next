export default class Singer {

  constructor (public id: string, public name: string, public avatar?: string | undefined) {
    this.avatar = avatar || `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
