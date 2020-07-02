<template>
  <scroll class="listview">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div v-for="item in list"></div>
    <!--    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"-->
    <!--         @touchmove.stop.prevent="onShortcutTouchMove"-->
    <!--         @touchend.stop>-->
    <!--      <ul>-->
    <!--        <li v-for="(item, index) in shortcutList" :data-index="index" class="item" :key="index"-->
    <!--            :class="{'current':currentIndex===index}">{{item}}-->
    <!--        </li>-->
    <!--      </ul>-->
    <!--    </div>-->
    <!--    <div class="list-fixed" ref="fixed" v-show="fixedTitle">-->
    <!--      <div class="fixed-title">{{fixedTitle}}</div>-->
    <!--    </div>-->
    <!--    <div v-show="!data.length" class="loading-container">-->
    <!--      <loading></loading>-->
    <!--    </div>-->
  </scroll>
</template>

<script lang="ts">
import Scroll from 'components/scroll/scroll.vue'
import { defineComponent, ref } from 'vue'

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
    function selectItem (item) {
      emit('select', item)
    }

    const list = ref([{name: 'djaof'}])
    return {
      selectItem,
      list
    }
  },
  components: {
    Scroll
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
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
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
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
