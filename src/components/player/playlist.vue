<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" class="item" v-for="(item,index) in sequenceList"
                @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span @click.stop="toggleFavorite(item)" class="like">
                        <i :class="getFavoriteIcon(item)"></i>
                      </span>
              <span @click.stop="deleteOne(item)" class="delete">
                        <i class="icon-delete"></i>
                      </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <!--      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>-->
      <!--      <add-song ref="addSong"></add-song>-->
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { playMode } from '@/common/js/config'
import { usePlayerInject } from '../../store/player'
import Song from 'common/js/song'
import Scroll from 'components/scroll/scroll.vue'

export default defineComponent({
  name: 'playlist',
  setup () {
    const showFlag = ref(true)
    const showConfirm = () => {
    }
    const hide = () => {
    }
    const {state: {sequenceList, mode}, currentSong} = usePlayerInject()
    const iconMode = computed(() => {
      const map: Record<playMode, string> = {
        [playMode.sequence]: 'icon-sequence',
        [playMode.loop]: 'icon-loop',
        [playMode.random]: 'icon-random'
      }
      return map[mode]
    })
    const modeText = computed(() => {
      const map: Record<playMode, string> = {
        [playMode.sequence]: '顺序播放',
        [playMode.loop]: '单曲循环',
        [playMode.random]: '随机播放'
      }
      return map[mode]
    })
    const addSong = () => {
    }
    const refreshDelay = () => {
    }
    const getCurrentIcon = (item: Song) => {
      if (currentSong.value.id === item.id) {
        return 'icon-play'
      }
      return ''
    }
    const toggleFavorite = () => {
    }
    const getFavoriteIcon = () => {
      return ''
    }
    const deleteOne = () => {
    }
    return {
      hide,
      showFlag,
      iconMode,
      modeText,
      addSong,
      showConfirm,
      sequenceList,
      refreshDelay,
      getCurrentIcon,
      toggleFavorite,
      getFavoriteIcon,
      deleteOne
    }
  },
  components: {
    Scroll
  }
})
</script>

<style lang="stylus" scoped src="./playlist.styl">
</style>
