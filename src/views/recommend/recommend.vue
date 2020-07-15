<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content">
      <div>
        <div v-if="recommend.length" class="slider-wrapper">
          <div class="slider-content">
            <slider class="slider" ref="slider">
              <div v-for="(item,index) in recommend" :key="index" class="slider-item">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" alt="t">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item,index) in discList" class="item" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <!--        <loading></loading>-->
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import Slider from '@/components/slider/slider.vue'
import Scroll from '@/components/scroll/scroll.vue'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface recommend {
  linkUrl: string;
  loadImage: string;
  picUrl: string;
}

export default defineComponent({
  name: 'recommend',
  setup () {
    const recommendData = reactive({
      discList: [],
      recommend: [] as recommend[]
    })
    const router = useRouter()
    const slider = ref(null as unknown as InstanceType<typeof Slider>)
    onMounted(async () => {
      const res = await axios.get('/api/music/getTopBanner')
      recommendData.recommend = res.data.data
      const res2 = await axios.get('/api/music/getDiscList')
      recommendData.discList = res2.data.data.list
    })

    function selectItem (item: any) {
      console.log(item)
      router.push({
        path: `/recommend/${item.dissid}`
      })
    }

    let checkloaded = false

    return {
      ...toRefs(recommendData),
      selectItem,
      router
    }
  },
  components: {
    Slider,
    Scroll
  }
})
</script>

<style lang="stylus" scoped>
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
