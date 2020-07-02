<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll"
            :probe-type="3" class="list" ref="list">
      <div class="song-list-wrapper">
        <!--        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>-->
      </div>
      <div v-show="!songs.length" class="loading-container">
        <!--        <loading></loading>-->
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import Scroll from 'components/scroll/scroll.vue'
import { useRouter } from 'vue-router'
import { getSingerSong } from 'api/music'

export default defineComponent({
  name: 'music-list',
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const router = useRouter()

    function back () {
      router.go(-1)
    }

    function listenScroll () {

    }

    function random () {

    }

    function scroll () {

    }

    // bgStyle()
    // {
    //   return `background-image:url(${this.bgImage})`
    // }
    const bgStyle = computed(() => {
      return `background-image:url(${props.bgImage})`
    })
    return {
      back,
      listenScroll,
      random,
      // bgImage: props.bgImage,
      bgStyle,
      scroll,
      router
      // title: props.title
    }
  },
  components: {
    Scroll
  }
})
</script>

<style lang="stylus" scoped>
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    //  background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      z-index 40
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
