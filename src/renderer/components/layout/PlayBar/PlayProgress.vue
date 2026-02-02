<template>
  <div :class="$style.content">
    <span class="my__number">{{ nowPlayTimeStr }}</span>
    <div :class="$style.progressBar">
      <common-progress-bar :height="4" :progress="progress" :handle-transition-end="handleTransitionEnd"
        :is-active-transition="isActiveTransition" />
    </div>
    <span class="my__number">{{ maxPlayTimeStr }}</span>
  </div>
</template>
<script>
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'

export default {
  props: {
    handleTransitionEnd: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const {
      progress,
      isActiveTransition,
      nowPlayTimeStr,
      maxPlayTimeStr,
    } = usePlayProgress()

    return {
      progress,
      isActiveTransition,
      nowPlayTimeStr,
      maxPlayTimeStr,
    }
  },
}
</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";

.content {
  width: 100%;
  z-index: 99;
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;
  font-size: 16px;

  span {
    display: inline-block;
    width: 50px;
    font-size: 12px;
    text-align: center;
  }

  &:hover {
    .progress {
      opacity: 1;
    }
  }
}

.progressBar {
  flex: auto;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
</style>
