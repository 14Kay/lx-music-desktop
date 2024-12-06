<template>
  <div :class="$style.playlistInfo">
    <common-cover
      :id="id"
      :class="$style.cover"
      :image-url="cover"
      :play-button-size="playButtonSize"
      :show-play-button="true"
      :always-show-shadow="true"
      :click-cover-to-play="false"
      :fixed-size="288"
      type="playlist"
      :cover-hover="false"
      @play="emit('play')"
    />
    <div :class="$style.info">
      <h3 :class="$style.title">{{ title }}</h3>
      <div :class="$style.author">
        <p>Playlist by {{ author }}</p>
      </div>
      <p :class="$style.create"><span v-if="createTime">创建于 {{ createTime }}·</span>{{ count }}首歌</p>
      <p :class="$style.description">{{ description }}</p>
      <div :class="$style.buttons">
        <base-button :class="$style.play" :radius="8" active @click="emit('play')">
            <base-svg-icon style="height: 16px" icon-class="play" /> <span>{{ $t('list__play') }}</span>
        </base-button>
        <div v-if="showCollect" :class="$style.heart" @click="emit('collect')"><base-svg-icon style="height: 16px" :icon-class="!isCollected ? 'heart': 'heart-solid'" /></div>
        <div v-if="id != LIST_IDS.LOVE && id != LIST_IDS.DEFAULT && !showCollect" :class="$style.heart" @click="emit('delete')">
            <base-svg-icon style="height: 16px" icon-class="delete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'
import { LIST_IDS } from '@common/constants'
const emit = defineEmits(['play', 'collect', 'delete'])

defineProps({
  id: { type: String, required: true },
  cover: { type: String, required: true },
  author: { type: String, required: true },
  playButtonSize: { type: Number, default: 18 },
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  count: { type: String, required: false, default: '0' },
  createTime: { type: String, required: false, default: '' },
  isCollected: { type: Boolean, default: false },
  showCollect: { type: Boolean, default: true },
})
</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";
.playlistInfo {
  display: flex;
}
.cover {
  width: 290px;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 56px;

  .title {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-900);

    .lock-icon {
      opacity: 0.28;
      color: var(--color-900);
      margin-right: 8px;
      .svg-icon {
        height: 26px;
        width: 26px;
      }
    }
  }

  .author {
    font-size: 18px;
    opacity: 0.88;
    color: var(--color-900);
    margin-top: 24px;
  }
  .create{
    font-size: 14px;
    opacity: 0.68;
    color: var(--color-900);
    margin-top: 2px;
  }
  .description {
    font-size: 14px;
    opacity: 0.68;
    color: var(--color-900);
    margin-top: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      transition: opacity 0.3s;
      opacity: 0.88;
    }
  }
  .buttons {
    margin-top: 32px;
    display: flex;
    button {
      margin-right: 16px;
    }

    .play{
        font-size: 18px;
        span{
            margin-left: 4px;
        }
    }
  }

  .heart{
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    background: transparent;
    height: 40px;
    width: 40px;
    border-radius: 25%;
    transition: 0.2s;
    border: none;
    outline: none;
    font-size: 20px;
    cursor: pointer;
    background: var(--color-050);
    margin-right: 16px;
    .svg-icon {
      color: #000;
      height: 16px;
      width: 16px;
    }
    &:first-child {
      margin-left: 0;
    }
    &:active {
      transform: scale(0.92);
    }
  }
}
</style>
