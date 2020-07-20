<template>
  <m-header></m-header>
  <tab></tab>
  <router-view v-slot="{Component}">
    <keep-alive>
      <component :is="Component" :style="routerViewBottom"></component>
    </keep-alive>
  </router-view>
  <player></player>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { usePlayerStore, usePlayerInject } from './store/player'
import MHeader from '@/components/m-header/m-header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from 'components/player/player.vue'

export default defineComponent({
  components: {MHeader, Tab, Player},
  data () {
    return {
      color: 'red'
    }
  },
  setup () {
    usePlayerStore()
    const {state} = usePlayerInject()
    const routerViewBottom = computed(() => {
      return {
        bottom: state.playlist.length ? '60px' : '0'
      }
    })
    return {
      routerViewBottom
    }
  }
})
</script>
