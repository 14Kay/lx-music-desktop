<template>
  <div :class="[$style.aside]">
    <div :class="$style.logo">
      <div :class="[$style.logoImageContainer, { 'no-drag': lastFmUserInfo.name }]" @click="openLastFM">
        <img :src="lastFmUserInfo.avatar || defaultLogo" alt="">
        <div v-if="lastFMTrackResult !== 'normal'" :class="$style.status">
          <base-svg-icon v-show="lastFMTrackResult === 'tracking'" :class="[$style.icon, $style.loader]"
            icon-class="loader" />
          <base-svg-icon v-show="lastFMTrackResult === 'success'" :class="$style.icon" icon-class="check" />
          <base-svg-icon v-show="lastFMTrackResult === 'error'" :class="$style.icon" icon-class="error" />
        </div>
      </div>
    </div>
    <NavBar />
  </div>
</template>

<script setup>
import { openUrl } from '@common/utils/electron'
import { lastFmUserInfo, lastFMTrackResult } from '@renderer/store'
import defaultLogo from '../../../assets/images/logo.png'

import NavBar from './NavBar.vue'

const openLastFM = () => {
  if (!lastFmUserInfo.name) return
  openUrl('https://www.last.fm/user/' + lastFmUserInfo.name)
}

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.aside {
  // box-shadow: 0 0 5px rgba(0, 0, 0, .3);
  transition: @transition-normal;
  transition-property: background-color;
  // background-color: @color-theme-sidebar;
  // background-color: @color-aside-background;
  // border-right: 2px solid var(--color-primary);
  -webkit-app-region: drag;
  -webkit-user-select: none;
  display: flex;
  flex-flow: column nowrap;

  &.fullscreen {
    -webkit-app-region: no-drag;

    .logo {
      display: none;
    }
  }
}

.logo {
  box-sizing: border-box;
  height: 72px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  // -webkit-app-region: no-drag;
  .logoImageContainer {
    position: relative;
    width: 50px;
    height: 50px;
    -webkit-app-region: no-drag;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }

  .status {
    position: absolute;
    right: -6px;
    bottom: -6px;
    background-color: var(--color-primary);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      height: 12px;
      width: 12px;
      color: var(--color-main-background);
    }

    .loader {
      animation: spin 1.25s linear infinite;
    }
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
</style>
