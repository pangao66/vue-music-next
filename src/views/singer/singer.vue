<template>
  <div class="singer">
    <list-view :data="singerList" @select="selectSinger"></list-view>
    <transition appear name="slide">
      <router-view :singer="singer"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import ListView from './list-view.vue'
import { getCommonSingerApi, getHotSingerApi } from 'api/music'
import { SingerItemInt } from "@/types/singer"
import Singer from "common/js/singer"

export default defineComponent({
  name: 'singer',
  setup () {
    const router = useRouter()
    const state = reactive({
      hot: [] as SingerItemInt[],
      common: [] as SingerItemInt[],
      singer: {} as Singer
    })


    function selectSinger (singer: Singer) {
      router.push({
        path: `/singer/${singer.id}`
      })
      state.singer = singer
    }

    async function getHotSinger () {
      const {data: {data}} = await getHotSingerApi()
      state.hot = data || []
    }

    async function getCommonSinger () {
      const {data: {data}} = await getCommonSingerApi()
      state.common = data || []
    }

    function getSingerClass (list: SingerItemInt[]): Singer[] {
      return list.map((item) => {
        return new Singer(item.singer_mid, item.singer_name)
      })
    }

    const singerList = computed(() => {
      let map: any = {}
      let ret: any[] = []
      let list = state.common
      list.forEach((item) => {
        const key = item.spell?.[0]?.toUpperCase() || '#'
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer(item.singer_mid, item.singer_name)
        )
      })
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return [
        {title: '热门', items: getSingerClass(state.hot)},
        ...ret
      ]
    })
    onMounted(() => {
      getHotSinger()
      getCommonSinger()
    })
    return {
      ...toRefs(state),
      singerList,
      selectSinger,
      router
    }
  },
  components: {
    ListView
  }
})
</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter-from, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
