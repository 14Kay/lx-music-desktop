<template>
  <material-popup-btn ref="btn_ref" :class="$style.btnContent">
    <div class="my__button" :aria-label="nextTogglePlayName">
      <PhShuffle v-if="appSetting['player.togglePlayMethod'] == 'random'" size="55%" weight="bold" />
      <PhQueue v-else-if="appSetting['player.togglePlayMethod'] == 'list'" size="55%" weight="bold" />
      <PhRepeatOnce v-else-if="appSetting['player.togglePlayMethod'] == 'singleLoop'" size="58%" weight="bold" />
      <PhRepeat v-else-if="appSetting['player.togglePlayMethod'] == 'listLoop'" size="55%" weight="bold" />
      <PhLock v-else size="55%" weight="bold" />
    </div>
    <template #content>
      <div :class="$style.setting">
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_list_loop')"
          @click="toggleMode('listLoop')">
          <PhRepeat size="80%" weight="bold" />
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_random')" @click="toggleMode('random')">
          <PhShuffle size="80%" weight="bold" />
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_list')" @click="toggleMode('list')">
          <PhQueue size="80%" weight="bold" />
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_single_loop')"
          @click="toggleMode('singleLoop')">
          <PhRepeatOnce size="80%" weight="bold" />
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_off')" @click="toggleMode('none')">
          <PhLock size="80%" weight="bold" />
        </button>
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
import { ref } from '@common/utils/vueTools'
// import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
// import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
// import { musicInfo, playMusicInfo } from '@renderer/store/player/state'
import { appSetting } from '@renderer/store/setting'
import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
import { PhShuffle, PhQueue, PhRepeatOnce, PhRepeat, PhLock } from '@phosphor-icons/vue'

const btn_ref = ref(null)

const {
  nextTogglePlayName,
  toggleNextPlayMode,
} = useNextTogglePlay()

const toggleMode = (mode) => {
  btn_ref.value.hide()
  toggleNextPlayMode(mode)
}

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btnContent {
  flex: none;
  height: 100%;
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
  flex-flow: row nowrap;
  font-size: 14px;
  gap: 10px;

  button {
    height: 24px;
  }
}
</style>
