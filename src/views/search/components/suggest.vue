<template>
  <scroll ref="suggest"
          class="suggest"
          :pullup="true"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item.docid">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}}-{{item.singer}}</p>
        </div>
      </li>
    </ul>
    <div v-show=" !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script lang="ts">
import Scroll from 'components/scroll/scroll.vue'
import NoResult from 'components/no-result/no-result.vue'
import { defineComponent, reactive, watch, computed, ComputedRef } from 'vue'
import { searchMusic, getSongInfo } from 'api/music'
import { SearchItem, SearchResultInt } from "api/types"
import Singer from "common/js/singer"
import { useRouter } from 'vue-router'
import { usePlayerInject } from "@/store/player"
import Song, { createSong } from "common/js/song"
import { useStorageInject } from "@/store/stroageStore"

export default defineComponent({
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup (props, {emit}) {
    const state = reactive({
      page: 1,
      hasMore: false,
      // result: [],
      singer: [] as SearchItem[],
      songs: [] as SearchItem[]
    })
    const router = useRouter()
    const search = async () => {
      const {data: {data}} = await searchMusic(props.query)
      const {singer, song} = data
      state.singer = singer.itemlist
      state.songs = song.itemlist
    }
    const result = computed(() => {
      const {singer, songs} = state
      return [
        ...singer.map((item) => {
          return {
            ...item,
            type: 'singer'
          }
        }),
        ...songs.map((item) => {
          return {
            ...item,
            type: 'song'
          }
        })
      ]
    })
    const {setSinger, insertSong} = usePlayerInject()
    type resultItemType = typeof result.value[0]
    const getIconCls = (item: resultItemType) => {
      const map = {
        singer: 'icon-mine',
        song: 'icon-music'
      }
      // @ts-ignore
      return map[item.type]
    }
    const selectItem = async (item: SearchItem) => {
      if (item.type === 'singer') {
        const singer = new Singer(item.mid, item.singer)
        await router.push({
          path: `/search/${singer.id}`
        })
        setSinger(singer)
      } else {
        const {data: {data}} = await getSongInfo({song_mid: item.mid})
        insertSong(createSong(data))
      }
      emit('select')
    }
    watch((() => props.query), (value) => {
      if (!value) {
        return
      }
      search()
    })
    return {
      result,
      getIconCls,
      selectItem,
      router
    }
  },
  components: {
    Scroll,
    NoResult
  }
})
</script>

<style scoped lang="stylus">
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
