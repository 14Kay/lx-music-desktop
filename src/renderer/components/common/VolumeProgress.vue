<template>
  <material-popup-btn :class="$style.btnContent">
    <button :class="[$style.btn, 'my__button']"
      :aria-label="isMute ? $t('player__volume_muted') : `${$t('player__volume')}${parseInt(volume * 100)}%`"
      @click="handleVolumeMute" @wheel="handleWheel">
      <component :is="icon" size="55%" weight="regular" />
    </button>
    <template #content>
      <div :class="$style.setting">
        <base-slider-bar vertical :height="100" :class="$style.slider" :value="volume" :min="0" :max="1"
          @change="handleUpdateVolume" />
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
import { computed } from '@common/utils/vueTools'
import { saveVolumeIsMute } from '@renderer/store/setting'
import { volume, isMute } from '@renderer/store/player/volume'
import { PhSpeakerSimpleHigh, PhSpeakerSimpleX, PhSpeakerSimpleLow } from '@phosphor-icons/vue'

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
  if (isMute.value || volume.value === 0) {
    return PhSpeakerSimpleX
  }

  if (volume.value < 0.5) {
    return PhSpeakerSimpleLow
  }

  return PhSpeakerSimpleHigh
})

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btnContent {
  flex: none;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
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
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }

  &:active {
    svg {
      opacity: 1;
    }
  }
}

.setting {
  width: 24px;
  /* 容器宽度 */
  height: 100px;
  /* 容器高度，要足够容纳垂直 Slider */
  padding: 10px 0;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
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
