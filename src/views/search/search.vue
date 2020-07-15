<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBoxRef"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
          </h1>
          <teleport to="#modal">
            <confirm ref="confirmRef" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
          </teleport>
          <search-list @select="addQuery" :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import SearchBox from './components/search-box.vue'
import Suggest from './components/suggest.vue'
import SearchList from './components/search-list.vue'
import Confirm from 'components/confirm.vue'
import { defineComponent, onMounted, reactive, toRefs, ref, Teleport } from 'vue'
import { getHotkey } from 'api/music'
import { HotKeyItem } from "api/types"
import { useStorageInject, useStorageProvide } from "@/store/stroageStore"

export default defineComponent({
  name: 'search',
  setup () {
    useStorageProvide()
    const state = reactive({
      hotKey: [] as HotKeyItem[],
      query: ''
    })
    const searchBoxRef = ref('' as unknown as ReturnType<typeof SearchBox>)
    const confirmRef = ref('' as unknown as ReturnType<typeof Confirm>)
    const {searchHistory, saveSearch: saveSearchStorage, clearSearch} = useStorageInject()
    const saveSearch = () => {
      saveSearchStorage(state.query)
    }
    const addQuery = (query: string) => {
      searchBoxRef.value.setQuery(query)
    }
    const onQueryChange = (query: string) => {
      state.query = query.trim()
    }
    const showConfirm = () => {
      confirmRef.value.show()
    }
    const clearSearchHistory = () => {
      console.log('删除')
      clearSearch()
    }
    onMounted(async () => {
      const {data: {data}} = await getHotkey()
      state.hotKey = data.hotkey.splice(0, 10)
    })
    return {
      addQuery,
      onQueryChange,
      searchBoxRef,
      confirmRef,
      saveSearch,
      searchHistory,
      showConfirm,
      clearSearchHistory,
      ...toRefs(state)
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Teleport,
    Confirm
  }
})
</script>

<style scoped lang="stylus">
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
