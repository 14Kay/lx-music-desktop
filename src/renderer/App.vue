<template>
  <div id="container" class="view-container" @click="handleClick">
    <layout-top id="top" />
    <layout-aside id="left" />
    <div id="main">
      <layout-view id="view" />
    </div>
    <div id="player-container">
      <layout-play-bar id="player" />
    </div>
    <layout-icons />
    <layout-change-log-modal />
    <layout-update-modal />
    <layout-pact-modal />
    <layout-sync-mode-modal />
    <layout-sync-auth-code-modal />
    <layout-play-detail />
  </div>
</template>

<script setup>
import { onMounted } from '@common/utils/vueTools'
// import BubbleCursor from '@common/utils/effects/cursor-effects/bubbleCursor'
// import '@common/utils/effects/snow.min'
import useApp from '@renderer/core/useApp'
import { inject } from 'vue'
const $bus = inject('$bus')

useApp()

const handleClick = () => {
  $bus.emit('click')
}

onMounted(() => {
  document.getElementById('root').style.display = 'block'

  // const styles = getComputedStyle(document.documentElement)
  // window.lxData.bubbleCursor = new BubbleCursor({
  //   fillStyle: styles.getPropertyValue('--color-primary-alpha-900'),
  //   strokeStyle: styles.getPropertyValue('--color-primary-alpha-700'),
  // })
})

// onBeforeUnmount(() => {
//   window.lxData.bubbleCursor?.destroy()
// })

</script>


<style lang="less">
@import './assets/styles/index.less';
@import './assets/styles/layout.less';

.title {
  font-size: 32px;
  color: var(--color-text);
  font-weight: 600;
  padding-top: @gap;
}

* {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;

  /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
}

html {
  height: 100vh;
}

html,
body {
  // overflow: hidden;
  box-sizing: border-box;
}

main::-webkit-scrollbar {
  width: 0px;
}

body {
  user-select: none;
  height: 100%;
}

#root {
  height: 100%;
  position: relative;
  overflow: hidden;
  color: var(--color-font);
  background: var(--background-image) var(--background-image-position) no-repeat;
  background-size: var(--background-image-size);
  transition: background-color @transition-normal;
  background-color: var(--color-content-background);
  box-sizing: border-box;
}

.disableAnimation * {
  transition: none !important;
  animation: none !important;
}

.transparent {
  background: transparent;

  // padding: @shadow-app;
  // #waiting-mask {
  //   border-radius: @radius-border;
  //   left: @shadow-app;
  //   right: @shadow-app;
  //   top: @shadow-app;
  //   bottom: @shadow-app;
  // }
  #body {
    border-radius: @radius-border;
  }

  #root {
    box-shadow: 0 0 @shadow-app rgba(0, 0, 0, 0.5);
    border-radius: @radius-border;
  }

  // #container {
  // border-radius: @radius-border;
  // background-color: transparent;
  // }
}

.disableTransparent {
  background-color: var(--color-content-background);

  #body {
    border: 1Px solid var(--color-primary-light-500);
  }

  #right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  // #view { // 偏移5px距离解决非透明模式下右侧滚动条无法拖动的问题
  //   margin-right: 5Px;
  // }
}

.fullscreen {
  background-color: var(--color-content-background);

  #right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

#container {
  position: relative;

  height: 100%;
  background-color: var(--color-app-background);
}

#left {
  flex: none;
  width: @width-app-left;
  position: fixed;
  top: 0;
  bottom: 84px;
  width: 60px;
  z-index: 9;
  background-color: var(--color-aside-background, transparent);
}

#right {
  flex: auto;
  display: flex;
  flex-flow: column nowrap;
  transition: background-color @transition-normal;
  background-color: var(--color-main-background);

  border-top-left-radius: @radius-border;
  border-bottom-left-radius: @radius-border;
  overflow: hidden;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
}

#toolbar,
#player {
  flex: none;
}

#view {
  position: relative;
  flex: auto;
  // display: flex;
  min-height: 0;
}

.view-container {
  transition: opacity @transition-normal;
}

#root.show-modal>.view-container {
  opacity: .9;
}

#view.show-modal>.view-container {
  opacity: .2;
}

#top {
  position: fixed;
  padding-top: @gap-md;
  padding-right: @gap;
  top: 0;
  right: 0;
  left: 60px;
  height: 54px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-top-background);
  z-index: 9;
  -webkit-app-region: drag;
}

#main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 60px;
  overflow: auto;
  padding: @gap-md @gap 84px @gap;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
  background-color: var(--color-main-background, #fafafa);
}

#player-container {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  height: 84px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-player-background, var(--color-primary-light-1000-alpha-150));
  z-index: 9;
  overflow: visible;
}
</style>
