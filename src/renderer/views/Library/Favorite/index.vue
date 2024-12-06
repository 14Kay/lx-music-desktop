<!--
 * @Description: 我的最爱
 * @Author: 14K
 * @Date: 2024-12-03 15:39:40
 * @LastEditTime: 2024-12-06 20:28:48
 * @LastEditors: 14K
-->
<template>
    <div :class="$style.favorite">
        <div :class="$style.favoriteCount" @click="goCollectList">
          <common-audio-visualizer :class="$style.audio" />
            <div :class="$style.music">
              <div :class="$style.cover">
                <img
                  v-if="musicInfo.pic"
                  :src="musicInfo.pic"
                  decoding="async"
                />
                <div v-else :class="$style.emptyPic">L<span>X</span></div>
              </div>
              <p :class="$style.title">{{ title }}</p>
              <p :class="$style.status">{{ statusText }} </p>
            </div>
            <div :class="$style.bottom">
                <div :class="$style.titles">
                    <div :class="$style.title">我最爱的音乐</div>
                    <div :class="$style.sub_title">{{ count }} 首歌</div>
                </div>
                <button :class="$style.play">
                    <base-svg-icon v-show="!isPlay" :class="$style.svg" icon-class="play" />
                    <base-svg-icon v-show="isPlay" :class="[$style.svg,$style.pause]" icon-class="pause" />
                </button>
            </div>
        </div>

        <div :class="$style.favoriteList">
            <List
                :list-id="listId"
                :list="list"
                :player-info="playerInfo"
                :playing="playing"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import List from './List.vue'
import useListInfo from './useListInfo'
import { useRouter } from 'vue-router'
import { loveList } from '@renderer/store/list/state'
import { useI18n } from '@root/lang'
import { computed } from 'vue'
import { appSetting } from '@renderer/store/setting'
import {
  musicInfo,
  isPlay,
  statusText,
} from '@renderer/store/player/state'

const t = useI18n()
const { listId, columnNumber } = defineProps({
  listId: {
    type: String,
    required: true,
  },
  columnNumber: {
    type: Number,
    default: 4,
  },
})
const {
  list,
  playerInfo,
  playing,
  count,
  cover,
} = useListInfo({ listId, maxCount: columnNumber * 3 })

const title = computed(() => {
  return musicInfo.name
    ? appSetting['download.fileName']
      .replace('歌名', musicInfo.name)
      .replace('歌手', musicInfo.singer)
    : ''
})

const router = useRouter()
const goCollectList = () => {
  console.log(count.value)
  router.push({
    path: '/library/playlist',
    query: {
      id: listId,
      title: t(loveList.name),
      count: count.value,
      cover: cover.value,
    },
  })
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.music{
  line-height: 1.5;
  font-size: 14px;
  width: 300px;
  color: var(--color-primary-alpha-200);
  .cover{
    img{
      width: 45px;
      height: 45px;
      border-radius: 5px;
    }

    .emptyPic {
      background-color: var(--color-primary-light-900-alpha-200);
      border-radius: @radius-border;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary-light-400-alpha-200);
      user-select: none;
      font-size: 20px;
      font-family: Consolas, "Courier New", monospace;

      span {
        padding-left: 3px;
      }
    }
  }

  .status, .title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.favorite{
    display: flex;
    margin-top: 24px;
}
.favoriteCount {
  flex: 3;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  box-sizing: border-box;
  position: relative;
  background: var(--color-primary-alpha-900);
  .audio{
    z-index: 1;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary);
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 18px;
    padding: 0 24px;
    z-index: 3;
    box-sizing: border-box;
    .title {
      font-size: 24px;
      font-weight: 700;
    }
    .sub_title {
      font-size: 15px;
      margin-top: 2px;
    }

    button {
      margin-bottom: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      width: 44px;
      background: var(--color-primary);
      border-radius: 50%;
      transition: 0.2s;
      box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      outline: none;
      border: none;
      .svg {
        color: var(--color-main-background);
        margin-left: 4px;
        height: 16px;
        width: 16px;
      }
      .pause{
        margin-left: 0
      }
      &:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.4);
      }
      &:active {
        transform: scale(0.94);
      }
    }
  }

  .randomLyric {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    opacity: 0.88;
    color: var(--color-primary);
    p {
      margin-top: 2px;
    }
  }
}
.favoriteList{
    flex: 7;
    margin-top: 8px;
    margin-left: 36px;
    overflow: hidden;
}
</style>
