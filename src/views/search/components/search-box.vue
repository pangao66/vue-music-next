<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="queryRef">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, customRef } from 'vue'

function useDebouncedRef (value: string, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    return {
      get () {
        track()
        return value
      },
      set (newValue: string) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

export default defineComponent({
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  setup (props, {emit}) {
    const query = ref('')
    const queryRef = ref('' as unknown as HTMLInputElement)
    const clear = () => {
      query.value = ''
    }
    const blur = () => {
      queryRef.value.blur()
    }
    const setQuery = (q: string) => {
      query.value = q
    }
    watch((() => query.value), (newQuery) => {
      emit('query', newQuery)
    })
    return {
      query,
      clear,
      blur,
      setQuery
    }
  }
})
</script>

<style scoped lang="stylus">
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
