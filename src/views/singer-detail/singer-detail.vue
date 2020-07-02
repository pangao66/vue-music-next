<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed, toRefs } from 'vue'
import axios from 'axios'
import MusicList from 'components/music-list/music-list.vue'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { useRoute } from 'vue-router'
import { getSingerSongApi } from "api/music"

export default defineComponent({
  name: 'singer-detail',
  props: {
    singer: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const route = useRoute()
    const state = reactive({
      songs: []
    })
    const title = computed(() => props.singer.name || '')
    const bgImage = computed(() => props.singer.avatar || '')

    function normalizeSongs (list: any) {
      let ret: any[] = []
      console.log(list)
      list.forEach((item: { songInfo: any }) => {
        console.log(item)
        let {songInfo} = item
        if (isValidMusic(songInfo)) {
          ret.push(createSong(songInfo))
        }
      })
      return ret
    }

    onMounted(async () => {
      const id = route.params.id as string
      const {data} = await getSingerSongApi({id})
      state.songs = data.songList || []
      const list = normalizeSongs(state.songs)
      console.log(list)
    })
    return {
      bgImage,
      title,
      route,
      ...toRefs(state),
    }
  },
  components: {
    MusicList
  }
})
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
