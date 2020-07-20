<template>
  <scroll class="listview" @scroll="scroll" listen-scroll
          :probe-type="3" ref="listViewRef">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group singer-list-group"
          :ref="el => { listGroupRef[i] = el }">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" :data-index="index" v-for="(item,index2) in group.items" :key="index2"
              class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <teleport to="#body-end">
      <div v-show="route.path==='/singer'">
        <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
             @touchmove.stop.prevent="onShortcutTouchMove"
             @touchend.stop>
          <ul>
            <li v-for="(item, index) in shortcutList" :data-index="index" class="item" :key="index"
                :class="{'current':currentIndex===index}">{{item}}
            </li>
          </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
          <div class="fixed-title">{{fixedTitle}}</div>
        </div>
      </div>
    </teleport>
    <div v-show="!data.length" class="loading-container">
      <!--      <loading></loading>-->
    </div>
  </scroll>
</template>

<script lang="ts">
import Scroll from 'components/scroll/scroll.vue'
import { defineComponent, ref, computed, Teleport, watch, nextTick, onMounted, Fragment, onBeforeUpdate } from 'vue'
import Song from "common/js/song"
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'list-view',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup (props, {emit}) {
    const route = useRoute()
    const listViewRef = ref('' as unknown as any)
    const divs = ref([])

    function selectItem (item: Song) {
      emit('select', item)
    }

    const listGroupRef = ref([])
    let touch = {} as { y1: number, anchorIndex: number }
    const onShortcutTouchStart = (e: TouchEvent) => {
      const el = e.target!
      let anchorIndex = parseInt(el.getAttribute('data-index'))
      let firstTouch = e.touches[0]
      touch.y1 = firstTouch.pageY
      touch.anchorIndex = anchorIndex
      _scrollTo(anchorIndex)
    }
    const onShortcutTouchMove = (e: TouchEvent) => {
    }
    const shortcutList = computed(() => {
      // @ts-ignore
      return props.data.map((group) => {
        return group.title.substr(0, 1)
      })
    })
    const list = ref([])
    const scrollY = ref(-1)
    const currentIndex = ref(0)
    const diff = ref(-1)
    const fixedTitle = computed(() => {
      if (scrollY.value > 0) {
        return ''
      }
      // @ts-ignore
      return props.data[currentIndex.value] ? props.data[currentIndex.value].title : ''
    })
    const scroll = (pos: { x: number, y: number }) => {
      scrollY.value = pos.y
    }
    let listHeight: any[] = []

    function _calculateHeight () {
      listHeight = []
      const list = document.querySelectorAll('.singer-list-group')
      let height = 0
      listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        listHeight.push(height)
      }
    }

    watch((() => scrollY.value), (newY) => {
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        currentIndex.value = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          currentIndex.value = i
          diff.value = height2 + newY
          return
        }
      }
    })
    //@ts-ignore
    watch(() => props.data, async () => {
      await nextTick()
      _calculateHeight()
    })


    function _scrollTo (index: number) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > listHeight.length - 2) {
        index = listHeight.length - 2
      }
      listViewRef.value.scrollToElement(document.querySelectorAll('.singer-list-group')[index], 0)
    }

    // 确保在每次变更之前重置引用
    onBeforeUpdate(() => {
      listGroupRef.value = []
      divs.value = []
    })
    return {
      listGroupRef,
      listViewRef,
      selectItem,
      list,
      onShortcutTouchStart,
      onShortcutTouchMove,
      shortcutList,
      currentIndex,
      fixedTitle,
      scroll,
      route,
      divs
    }
  },
  components: {
    Scroll,
    Teleport,
    Fragment
  }
})
</script>

<style lang="stylus">
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: calc(50% + 44px)
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: fixed
    top: 88px
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
</style>
