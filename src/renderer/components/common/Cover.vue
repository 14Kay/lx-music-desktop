<template>
    <div
      class="cover"
      :class="{ 'cover-hover': coverHover }"
      @mouseover="focus = true"
      @mouseleave="focus = false"
      @click="clickCoverToPlay ? $emit('play') : $emit('goto')"
    >
      <div class="cover-container">
        <div class="shade">
          <button
            v-show="focus"
            class="play-button"
            :style="playButtonStyles"
            @click.stop="$emit('play')"
          >
            <base-svg-icon icon-class="play" />
          </button>
        </div>
        <img v-if="imageUrl" :src="imageUrl" :style="imageStyles" loading="lazy" title="cover" alt="cover" />
        <img v-else src="./../../assets/images/default_cover.jpg" alt="cover">
        <transition v-if="coverHover || alwaysShowShadow" name="fade">
          <div
            v-show="focus || alwaysShowShadow"
            class="shadow"
            :style="shadowStyles"
          ></div>
        </transition>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed, toRefs } from 'vue'

defineEmits(['play', 'goto'])

const props = defineProps({
  imageUrl: { type: String, required: true },
  fixedSize: { type: Number, default: 0 },
  playButtonSize: { type: Number, default: 22 },
  coverHover: { type: Boolean, default: true },
  alwaysShowPlayButton: { type: Boolean, default: true },
  alwaysShowShadow: { type: Boolean, default: false },
  clickCoverToPlay: { type: Boolean, default: false },
  shadowMargin: { type: Number, default: 12 },
  radius: { type: Number, default: 12 },
})

const { imageUrl, fixedSize, playButtonSize, alwaysShowShadow } = toRefs(props)
const focus = ref(false)

const imageStyles = computed(() => {
  const styles = {}
  if (fixedSize.value !== 0) {
    styles.width = fixedSize.value + 'px'
    styles.height = fixedSize.value + 'px'
  }
  return styles
})

const playButtonStyles = computed(() => {
  const styles = {}
  styles.width = playButtonSize.value + '%'
  styles.height = playButtonSize.value + '%'
  return styles
})

const shadowStyles = computed(() => {
  const styles = {}
  styles.backgroundImage = `url(${imageUrl.value})`
  return styles
})
</script>

  <style lang="less" scoped>
  .cover {
    position: relative;
    transition: transform 0.3s;
  }
  .cover-container {
    position: relative;
  }
  img {
    border-radius: 0.75em;
    width: 100%;
    user-select: none;
    aspect-ratio: 1 / 1;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  .noImage{
    border-radius: 0.75em;
    width: 100%;
    user-select: none;
    aspect-ratio: 1 / 1;
    border: 1px solid rgba(0, 0, 0, 0.04);
    background: var(--color-primary-alpha-400);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: var(--color-primary-light-1000);
  }
  .cover-hover {
    &:hover {
      cursor: pointer;
    }
  }

  .shade {
    position: absolute;
    top: 0;
    height: calc(100% - 3px);
    width: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .play-button{
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.08);
    height: 22%;
    width: 22%;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.2s;
    .svg-icon {
      width: 50%;
      margin-left: 4px;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    &:active {
      transform: scale(0.94);
    }
  }

  .shadow {
    position: absolute;
    top: 12px;
    height: 100%;
    width: 100%;
    filter: blur(16px) opacity(0.6);
    transform: scale(0.92, 0.96);
    z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
    aspect-ratio: 1 / 1;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  </style>
