<template>
  <div :class="$style.favorite">
    <div :class="$style.favoriteCount" @click="showPlayerDetail" :style="themeColor ? { background: themeColor } : {}">
      <div>
        <common-audio-visualizer :class="$style.audio" :color="visualizerColor" :bar-count="120" />
        <div :class="$style.content">
          <div :class="$style.music">
            <div :class="$style.cover">
              <div>
                <img v-if="musicInfo.pic" :src="musicInfo.pic" decoding="async" />
                <div v-else :class="$style.emptyPic">L<span>X</span></div>
              </div>
              <div :class="$style.musicInfo">
                <p :class="$style.name">{{ musicInfo.name }}</p>
                <p :class="$style.singer">{{ musicInfo.singer }}</p>
              </div>
            </div>
          </div>
          <div :class="$style.bottom">
            <div :class="$style.titles">
              <!-- <div :class="$style.title">我最爱的音乐</div>
              <div :class="$style.sub_title">{{ count }} 首</div> -->
              <p :class="$style.status">{{ statusText }} </p>
              <p v-show="!statusText">Wating for playing...</p>
            </div>
            <button :class="$style.play" @click.stop="togglePlay">
              <base-svg-icon v-show="!isPlay" :class="$style.svg" icon-class="play" />
              <base-svg-icon v-show="isPlay" :class="[$style.svg, $style.pause]" icon-class="pause" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div :class="$style.favoriteList">
      <List :column-number="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import List from './List.vue'
import useListInfo from './useListInfo'
import { useI18n } from '@root/lang'
import { ref, watch } from 'vue'
import { togglePlay } from '@renderer/core/player'

import {
  setShowPlayerDetail,
} from '@renderer/store/player/action'

import {
  musicInfo,
  isPlay,
  statusText,
  playMusicInfo,
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
  count,
  cover,
} = useListInfo({ listId, maxCount: columnNumber * 3 })

const showPlayerDetail = () => {
  if (!playMusicInfo.musicInfo) return
  setShowPlayerDetail(true)
}

const themeColor = ref('')
const visualizerColor = ref('')

const getDominantColor = (imgUrl: string) => {
  return new Promise<{ r: number, g: number, b: number } | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = imgUrl
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        canvas.width = 1
        canvas.height = 1
        ctx.drawImage(img, 0, 0, 1, 1)
        const data = ctx.getImageData(0, 0, 1, 1).data
        resolve({ r: data[0], g: data[1], b: data[2] })
      } catch (e) {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
  })
}

watch(() => musicInfo.pic, async (pic) => {
  if (!pic) {
    themeColor.value = ''
    visualizerColor.value = ''
    return
  }
  const color = await getDominantColor(pic)
  if (color) {
    themeColor.value = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`
    visualizerColor.value = 'rgba(255, 255, 255, 0.6)'
  } else {
    // Retrieval failed (likely CORS), fallback to defaults
    themeColor.value = ''
    // Use a high-contrast default for visualizer (e.g., white with opacity) to avoid gray-on-gray issues
    visualizerColor.value = 'rgba(255, 255, 255, 0.4)'
  }
}, { immediate: true })

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.empty {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.status {
  font-size: 20px;
  font-family: 'Outfit';
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.14);
  transition: 0.2s;
  padding: @gap;
  color: #fff;
  box-sizing: border-box;
}

.music {
  font-size: 14px;
  font-family: 'Outfit';

  .musicInfo {
    display: flex;
    flex-direction: column;
    height: 40px;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.9);

    .singer {
      font-size: 12px;
    }
  }

  .cover {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 45px;

    img {
      width: 45px;
      height: 45px;
      box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
    }

    .emptyPic {
      background-color: var(--color-primary-light-400-alpha-200);
      border-radius: @radius-border;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary-light-200-alpha-200);
      user-select: none;
      font-size: 20px;
      font-family: Consolas, "Courier New", monospace;

      span {
        padding-left: 3px;
      }
    }
  }
}

.line {
  width: 50px;
  height: 2px;
  background-color: rgba(255, 255, 255, 1);
  position: absolute;
  top: 50%;
  left: @gap;
}

.favorite {
  display: flex;
  margin-top: 24px;
  min-height: 220px;
}

.favoriteCount {
  flex: 4;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  box-sizing: border-box;
  position: relative;
  background: var(--color-primary-alpha-900);
  overflow: hidden;

  >div {
    padding: @gap;
    height: 100%;
    box-sizing: border-box;
  }

  .audio {
    z-index: 1;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 18px;
    padding: 0 24px;
    z-index: 3;
    box-sizing: border-box;

    .title {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 1px;
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
      box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      outline: none;
      border: none;
      flex-shrink: 0;

      .svg {
        color: var(--color-main-background);
        margin-left: 4px;
        height: 16px;
        width: 16px;
      }

      .pause {
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

.favoriteList {
  flex: 1;
  margin-left: @gap;
  overflow: hidden;
}
</style>
