<template>
  <material-popup-btn :class="$style.btnContent">
    <template #content>
      <div :class="$style.setting">
        <base-slider-bar :class="$style.slider" :value="volume" :min="0" :max="1" @change="handleUpdateVolume" />
      </div>
    </template>
    <button :class="[$style.btn, 'my__button']"
      :aria-label="isMute ? $t('player__volume_muted') : `${$t('player__volume')}${parseInt(volume * 100)}%`"
      @wheel="handleWheel" @click="handleVolumeMute">
      <component :is="icon" size="85%" weight="regular" />
    </button>
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
}

.setting {
  display: flex;
  flex-flow: column nowrap;
  padding: 2px 3px;
  width: 100%;
  padding-top: 8px;
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
