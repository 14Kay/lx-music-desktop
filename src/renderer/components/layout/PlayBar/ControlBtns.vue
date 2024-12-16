<template>
  <div :class="$style.controlBtn">
    <!-- <common-volume-bar /> -->
    <div v-if="appSetting['lastFM.enable']" :class="[$style.lastFm]" @click="openLastFM">
      <base-svg-icon v-show="lastFMTrackResult === 'normal'" :class="$style.lastFmSvg" style="height: 18px" icon-class="last-fm" />
      <base-svg-icon v-show="lastFMTrackResult === 'tracking'" :class="[$style.lastFmSvg, $style.loader]" style="height: 18px" icon-class="loader" />
      <base-svg-icon v-show="lastFMTrackResult === 'success'" :class="$style.lastFmSvg" style="height: 18px" icon-class="check" />
      <base-svg-icon v-show="lastFMTrackResult === 'error'" :class="$style.lastFmSvg" style="height: 18px" icon-class="error" />
      <div :class="$style.username">
        {{ appSetting['lastFM.session.name'] }}
      </div>
    </div>
    <button :class="$style.titleBtn" :aria-label="$t('player__add_music_to')" @click="addMusicTo">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="75%" viewBox="0 0 512 512" space="preserve">
        <use xlink:href="#icon-heart" />
      </svg>
    </button>
    <button :class="$style.titleBtn" :aria-label="toggleDesktopLyricBtnTitle" @click="toggleDesktopLyric" @contextmenu="toggleLockDesktopLyric">
      <svg v-show="appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 512 512" space="preserve">
        <use xlink:href="#icon-desktop-lyric-on" />
      </svg>
      <svg v-show="!appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 512 512" space="preserve">
        <use xlink:href="#icon-desktop-lyric-off" />
      </svg>
    </button>
    <common-toggle-play-mode-btn />
    <common-volume-progress />
    <common-list-add-modal v-model:show="isShowAddMusicTo" :music-info="playMusicInfo.musicInfo" />
  </div>
</template>

<script>
import { ref } from '@common/utils/vueTools'
import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
import { musicInfo, playMusicInfo } from '@renderer/store/player/state'
import { appSetting } from '@renderer/store/setting'
import { lastFMTrackResult } from '@renderer/store'

export default {
  setup() {
    const isShowAddMusicTo = ref(false)
    const {
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    } = useToggleDesktopLyric()
    const addMusicTo = () => {
      if (!musicInfo.id) return
      isShowAddMusicTo.value = true
    }
    const openLastFM = () => {
      window.open('https://www.last.fm/user/' + appSetting['lastFM.session.name'])
    }
    return {
      appSetting,
      isShowAddMusicTo,
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
      addMusicTo,
      playMusicInfo,
      lastFMTrackResult,
      openLastFM,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.last-fm{
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 6px;
  border-radius: 10px;
  transition: all .15s ease;
  &:hover{
    background-color: var(--color-primary-alpha-900);
  }
  .lastFmSvg{
    color: var(--color-primary)
  }
  .username{
    margin-left: 6px;
  }

  .loader{
    animation: spin 1.25s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.controlBtn {
  padding-left: 20px;
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  align-items: center;
  button {
    color: var(--color-1000);
  }
}

.titleBtn {
  flex: none;
  height: 100%;
  width: 24px;
  transition: @transition-fast;
  transition-property: color, opacity;
  // color: var(--color-button-font);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  width: 24px;
  padding: 0;

  opacity: .6;
  cursor: pointer;

  svg {
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    opacity: 1;
  }
  &:active {
    opacity: 1;
  }
}


</style>
