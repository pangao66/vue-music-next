<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Song from "common/js/song"

export default defineComponent({
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  setup (props, {emit}) {
    function selectItem (item: any, index: number) {
      console.log(item)
      emit('select', item, index)
    }

    function getDesc (song: any) {
      return `${song.singer}·${song.album}`
    }

    function getRankText (index: number) {
      if (index > 2) {
        return index + 1
      }
    }

    function getRankCls (index: number) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    }

    return {
      selectItem,
      getDesc,
      getRankText,
      getRankCls
    }
  }
})
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
