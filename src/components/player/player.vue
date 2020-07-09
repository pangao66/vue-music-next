<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal" @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" style="width: 100%; height: 100%;" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleLeftRef">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" class="image" :class="cdCls">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricListRef">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p :ref="el=>{lyricLineRef[index]=el}" class="text" :class="{current:currentLineNum===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot" :class="{active:currentShow==='cd'}"></div>
            <div class="dot" :class="{active:currentShow==='lyric'}"></div>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percent-change="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img width="40" height="40" :src="currentSong.image" :class="cdCls">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayIcon" class="icon-mini" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUpdate, ref, toRefs } from 'vue'
import { usePlayerInject } from '../../store/player'
import useAnimate from './useAnimate'
import { usePlay, useReady, useTime, useLyric, useShow } from "./usePlay"
import ProgressBar from 'components/progress-bar/progress-bar.vue'
import ProgressCircle from "components/progress-circle/progress-circle.vue"
import { playMode } from '@/common/js/config'
import { shuffle } from "common/js/util"
import Scroll from 'components/scroll/scroll.vue'
// import animations from 'create-keyframe-animation'
export default defineComponent({
  name: 'player',
  setup () {
    const audio = ref('' as unknown as HTMLAudioElement)
    const songReady = ref(false)
    const {state, currentSong, setFullScreen, setPlayingState, setCurrentIndex, setPlayMode, setPlayList} = usePlayerInject()
    const {playIcon, miniPlayIcon, cdCls, disableCls, iconMode} = usePlay(audio, state, currentSong, songReady)
    const {ready, error} = useReady(songReady)
    const {enter, afterEnter, leave, afterLeave, cdWrapper} = useAnimate()
    const {currentTime, updateTime, formatTime} = useTime()
    const {lyricState, lyricListRef, lyricLineRef,} = useLyric(currentSong, state)
    const {
      currentShow, middleTouchStart,
      middleTouchMove,
      middleTouchEnd,
      middleLeftRef
    } = useShow(lyricListRef)
    const percent = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    function back () {
      setFullScreen(false)
    }

    function open () {
      setFullScreen(true)
    }

    /******--------播放控制--------********/
      // 暂停/播放
    const togglePlay = () => {
        if (!songReady.value) {
          return
        }
        setPlayingState(!state.playing)
        if (lyricState.currentLyric) {
          lyricState.currentLyric.togglePlay()
        }
      }

    // 下一曲
    const next = () => {
      let index = state.currentIndex + 1
      if (index === state.playlist.length) {
        index = 0
      }
      setCurrentIndex(index)
      if (!state.playing) {
        togglePlay()
      }
      songReady.value = false
    }

    // 上一曲
    const prev = () => {
      if (!songReady.value) {
        return
      }
      let index = state.currentIndex - 1
      if (index === -1) {
        index = state.playlist.length - 1
      }
      setCurrentIndex(index)
      if (!state.playing) {
        togglePlay()
      }
      songReady.value = false
    }

    const end = () => {
      if (state.mode === playMode.loop) {
        loop()
      } else {
        next()
      }
    }

    const loop = () => {
      audio.value.currentTime = 0
      audio.value.play()
      if (lyricState.currentLyric) {
        lyricState.currentLyric.seek(0)
      }
    }

    // 切换播放模式
    function changeMode () {
      const mode = (state.mode + 1) % 3
      setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(state.sequenceList)
      } else {
        list = state.sequenceList
      }
      resetCurrentIndex(list)
      setPlayList(list)
    }

    // 重置当前索引
    function resetCurrentIndex (list: any[]) {
      let index = list.findIndex((item) => {
        return item.id === currentSong.value.id
      })
      setCurrentIndex(index)
    }

    function onProgressBarChange (percent: number) {
      const currentTime = currentSong.value.duration * percent
      audio.value.currentTime = currentTime
      if (!state.playing) {
        togglePlay()
      }
      if (lyricState.currentLyric) {
        lyricState.currentLyric.seek(currentTime * 100)
      }
    }

// 确保在每次变更之前重置引用
    onBeforeUpdate(() => {
      lyricLineRef.value = []
    })
    return {
      ...toRefs(state),
      currentSong,
      back,
      open,
      enter,
      afterEnter,
      leave,
      afterLeave,
      cdWrapper,
      audio,
      togglePlay,
      //--播放状态图标---//
      playIcon,
      miniPlayIcon,
      cdCls,
      disableCls,
      iconMode,
      // 播放控制
      next,
      prev,
      changeMode,
      end,
      // ready
      songReady, ready, error,
      // 时间控制
      currentTime, updateTime, formatTime,
      percent,
      onProgressBarChange,
      ...toRefs(lyricState),
      lyricListRef,
      lyricLineRef,
      currentShow,
      middleTouchStart,
      middleTouchMove,
      middleTouchEnd,
      middleLeftRef
    }
  },
  components: {
    ProgressCircle,
    ProgressBar,
    Scroll
  }
})
</script>

<style scoped lang="stylus" src="./player.styl">

</style>
