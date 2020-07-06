import Singer from "common/js/singer"
import { playMode } from "common/js/config"

export declare interface PlayStoreInt {
  singer: Singer
  playing: boolean
  fullScreen: boolean
  playlist: any[]
  sequenceList: any[]
  mode: playMode
  currentIndex: number
}
