<template>
  <transition appear name="slide">
    <div>
      <music-list></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list.vue'

export default {
  name: 'disc',
  components: {
    MusicList
  }
}
</script>

<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
