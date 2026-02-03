<template>
  <div :class="$style.song">
    <div :class="$style.cover">
      <img v-if="cover !== null && cover !== ''" :src="resizeImage(cover, 64)" alt="cover" loading="lazy" />
      <img v-else src="./../../../assets/images/default_cover.jpg" />
    </div>
    <div :class="$style.info">
      <div :class="$style.name">{{ name }}</div>
      <div :class="$style.singer">{{ singer }}</div>
    </div>
    <div v-if="playCount" :class="$style.playCount">
      <span>{{ playCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resizeImage } from '@renderer/utils/resizeCover'

defineProps({
  cover: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    required: true,
  },
  playCount: {
    type: Number,
    required: false,
    default: 0,
  },
})

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.song {
  display: flex;
  align-items: center;
  height: 36px;
  user-select: none;
  cursor: pointer;

  .cover {
    height: 100%;

    img {
      height: 36px;
      width: 36px;
      margin-right: 12px;
    }

    img.hover {
      filter: drop-shadow(100 200 0 black);
    }
  }

  .info {
    .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text);
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .singer {
      margin-top: 2px;
      font-size: 12px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  .playCount {
    margin-left: auto;
    padding-left: 12px;

    span {
      display: inline-block;
      background: var(--color-primary-alpha-200);
      color: var(--color-primary);
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
      min-width: 24px;
      text-align: center;
      opacity: 0;
    }
  }
}
</style>
