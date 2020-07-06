<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view v-slot="{Component}">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <player></player>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from './store/player'
import MHeader from '@/components/m-header/m-header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from 'components/player/player.vue'


export default defineComponent({
  components: {MHeader, Tab, Player},
  setup () {
    usePlayerStore()
  }
})
</script>
<style lang="stylus">
</style>
