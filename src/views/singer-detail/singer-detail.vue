<template>
  <music-list :title="title" :bg-image="bgImage" :songs="songs" :style="routerViewBottom"></music-list>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed, toRefs } from 'vue'
import axios from 'axios'
import MusicList from 'components/music-list/music-list.vue'
import Song, { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { useRoute } from 'vue-router'
import { getSingerSongApi } from "api/music"
import { usePlayerInject } from "@/store/player"


export default defineComponent({
  name: 'singer-detail',
  setup (props) {
    const route = useRoute()
    const state = reactive({
      songs: [] as Song[]
    })
    const {state: playerState} = usePlayerInject()
    const title = computed(() => playerState.singer.name || '')
    const bgImage = computed(() => playerState.singer.avatar || '')

    function normalizeSongs (list: any) {
      let ret: any[] = []
      list.forEach((item: { songInfo: any }) => {
        let {songInfo} = item
        if (isValidMusic(songInfo)) {
          ret.push(createSong(songInfo))
        }
      })
      return ret
    }

    const routerViewBottom = computed(() => {
      return {
        bottom: playerState.playlist.length ? '60px' : '0'
      }
    })
    onMounted(async () => {
      const id = route.params.id as string
      const {data: {data}} = await getSingerSongApi({id})
      const songs = normalizeSongs(data.songList) as Song[]
      state.songs = await processSongsUrl(songs)
    })
    return {
      bgImage,
      title,
      route,
      routerViewBottom,
      ...toRefs(state),
    }
  },
  components: {
    MusicList
  }
})
</script>

<style lang="stylus" scoped>

</style>
