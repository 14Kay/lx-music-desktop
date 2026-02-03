<template>
  <material-popup-btn :class="$style.btnContent">
    <button class="my__button" :aria-label="`${$t('player__playback_rate')}${playbackRate}x`">
      <component :is="PhSpeedometer" size="80%" weight="regular" />
    </button>
    <template #content>
      <div :class="$style.setting">
        <div :class="$style.info">
          <span>{{ playbackRate.toFixed(2) }}x</span>
          <div :class="$style.control">
            <base-checkbox id="player__playback_preserves_pitch" :model-value="appSetting['player.preservesPitch']"
              :label="$t('player__playback_preserves_pitch')" @update:model-value="updatePreservesPitch" />
            <!-- <base-btn min @click="handleUpdatePlaybackRate(100)">{{ $t('player__playback_rate_reset_btn') }}</base-btn> -->
          </div>
        </div>
        <div :class="$style.presets">
          <base-btn v-for="rate in presets" :key="rate" min :class="{ active: playbackRate === rate }"
            @click="handleUpdatePlaybackRate(rate * 100)">{{ rate }}</base-btn>
        </div>
        <base-slider-bar :class="$style.slider" width="100%" :value="playbackRate * 100" :min="50" :max="200"
          @change="handleUpdatePlaybackRate" />
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
// import { computed } from '@common/utils/vueTools'
import { playbackRate } from '@renderer/store/player/playbackRate'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { PhSpeedometer } from '@phosphor-icons/vue'

const presets = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

const handleUpdatePlaybackRate = (val) => {
  window.app_event.setPlaybackRate(Math.round(val) / 100)
}


const updatePreservesPitch = (enabled) => {
  updateSetting({ 'player.preservesPitch': enabled })
}

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
  gap: 10px;
  min-width: 210px;
}

.info {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.control {
  align-items: center;
  display: flex;
  gap: 10px;
}

.presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  :global(.base-btn) {
    justify-content: center;

    &.active {
      color: var(--color-primary);
      background-color: var(--color-primary-alpha-200);
    }
  }
}

.slider {
  width: 100%;
}
</style>
