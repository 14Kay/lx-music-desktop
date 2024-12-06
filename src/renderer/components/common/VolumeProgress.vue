<template>
    <div :class="$style.btnContent">
        <button :class="$style.btn" :aria-label="isMute ? $t('player__volume_muted') : `${$t('player__volume')}${parseInt(volume * 100)}%`" @click="handleVolumeMute" @wheel="handleWheel">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
            <use :xlink:href="icon" />
            </svg>
        </button>
        <div :class="$style.setting">
            <base-slider-bar :width="85" :class="$style.slider" :value="volume" :min="0" :max="1" @change="handleUpdateVolume" />
        </div>
    </div>
  </template>

<script setup>
import { computed } from '@common/utils/vueTools'
// import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
// import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
// import { musicInfo, playMusicInfo } from '@renderer/store/player/state'
import { saveVolumeIsMute } from '@renderer/store/setting'
import { volume, isMute } from '@renderer/store/player/volume'

const handleWheel = (event) => {
  window.app_event.setVolume(Math.round(volume.value * 100 + (-event.deltaY / 100 * 2)) / 100)
}

const handleUpdateVolume = (val) => {
  window.app_event.setVolume(val)
}

const handleVolumeMute = () => {
  saveVolumeIsMute(!isMute.value)
}

const icon = computed(() => {
  return isMute.value
    ? '#icon-volume-mute-outline'
    : volume.value == 0
      ? '#icon-volume-off-outline'
      : volume.value < 0.3
        ? '#icon-volume-low-outline'
        : volume.value < 0.7
          ? '#icon-volume-medium-outline'
          : '#icon-volume-high-outline'
})

</script>

  <style lang="less" module>
  @import '@renderer/assets/styles/layout.less';
  .btnContent {
    flex: none;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .btn {
    position: relative;
    // color: var(--color-button-font);
    justify-content: center;
    align-items: center;
    transition: color @transition-normal;
    cursor: pointer;
    background-color: transparent;
    border: none;
    width: 24px;
    display: flex;
    flex-flow: column nowrap;
    padding: 0;

    svg {
      transition: opacity @transition-fast;
      opacity: .6;
      filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
    }
    &:hover {
      svg {
        opacity: .9;
      }
    }
    &:active {
      svg {
        opacity: 1;
      }
    }
  }

  .setting {
    display: flex;
    flex-flow: column nowrap;
    padding: 2px 3px;
    margin-left: 6px;
  }

  .info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    span {
      line-height: 1.2;
    }
  }

  .slider {
    width: 100%;
  }

  </style>
