<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStorageInject } from "@/store/stroageStore"

export default defineComponent({
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup (props, {emit}) {
    const {deleteSearch} = useStorageInject()
    const selectItem = (item: string) => {
      emit('select', item)
    }
    const deleteOne = (item: string) => {
      deleteSearch(item)
    }
    return {
      selectItem,
      deleteOne
    }
  }
})
</script>

<style scoped lang="stylus">
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter-from, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
