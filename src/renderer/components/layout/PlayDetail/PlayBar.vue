<template>
  <div :class="$style.footer">
    <div :class="$style.footerLeft">
      <control-btns />
      <div :class="$style.progressContainer">
        <div :class="$style.progressContent">
          <common-progress-bar :class-name="$style.progress" :progress="progress"
            :handle-transition-end="handleTransitionEnd" :is-active-transition="isActiveTransition" />
        </div>
      </div>
      <div :class="[$style.timeLabel, 'my__number']">
        <span>{{ nowPlayTimeStr }}</span><span>{{ status }}</span><span>{{ maxPlayTimeStr }}</span>
      </div>
    </div>

    <div :class="$style.playBtnContainer">
      <common-toggle-play-mode-btn />
      <div :class="$style.playBtnContent">
        <div :class="$style.arrow" :aria-label="$t('player__prev')" @click="playPrev()">
          <PhRewind size="55%" weight="fill" />
        </div>

        <div class="my__button_fill my__button" :aria-label="isPlay ? $t('player__pause') : $t('player__play')"
          @click="togglePlay">
          <PhPause v-if="isPlay" size="35%" weight="fill" />
          <PhPlay v-else size="35%" weight="fill" />
        </div>

        <div :class="$style.arrow" :aria-label="$t('player__next')" @click="playNext()">
          <PhFastForward size="55%" weight="fill" />
        </div>
      </div>
      <div :class="[$style.list, 'my__button']" @click="togglePlaylistPopup">
        <svg t="1769493815060" height="54%" width="54%" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="112" y="185" width="400" height="80" fill="currentColor" />
          <rect x="112" y="467" width="800" height="80" fill="currentColor" />
          <rect x="112" y="749" width="520" height="80" fill="currentColor" />
        </svg>
      </div>
    </div>

    <PlaylistPopup v-model:show="isShowPlaylistPopup" />
  </div>
</template>

<script setup>
import { playNext, playPrev, togglePlay } from '@renderer/core/player'
import { status, isPlay } from '@renderer/store/player/state'
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'
import { PhPause, PhPlay, PhRewind, PhFastForward } from '@phosphor-icons/vue'
import PlaylistPopup from './../../layout/PlayBar/PlaylistPopup.vue'
import { ref } from '@common/utils/vueTools'

import ControlBtns from './components/ControlBtns.vue'

const isShowPlaylistPopup = ref(false)
const {
  nowPlayTimeStr,
  maxPlayTimeStr,
  progress,
  isActiveTransition,
  handleTransitionEnd,
} = usePlayProgress()


const togglePlaylistPopup = () => {
  isShowPlaylistPopup.value = !isShowPlaylistPopup.value
}

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.footer {
  min-height: 135px;
}

.playBtnContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.playBtnContent {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.arrow {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-primary);
}

.footerLeft {
  flex: auto;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
}

.progressContainer {
  width: 100%;
  position: relative;
  padding: 3px 0;
}

.progressContent {
  position: relative;
  height: 16px;
  padding: 5px 0;
  width: 100%;
}

.progress {
  height: 100%;
}

.barTransition {
  transition-property: transform;
  transition-timing-function: ease-out;
  transition-duration: 0.2s;
}

.timeLabel {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  span {
    font-size: 13px;
  }
}

.status {
  flex: auto;
}

.playControl {
  flex: none;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 25px;
  color: var(--color-button-font);
}

.playBtn {
  height: 40%;
  padding: 5px;
  cursor: pointer;
  flex: none;
  // transition: @transition-normal;
  // transition-property: color;
  color: var(--color-button-font);
  transition: opacity 0.2s ease;
  opacity: 1;
  cursor: pointer;

  +.playBtn {
    margin-left: 10px;
  }

  svg {
    fill: currentColor;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
}
</style>
