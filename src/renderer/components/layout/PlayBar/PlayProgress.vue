<template>
  <div :class="$style.content">
    <common-progress-bar
:height="2" :progress="progress" :handle-transition-end="handleTransitionEnd"
      :is-active-transition="isActiveTransition"
/>
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
    const { progress, isActiveTransition } = usePlayProgress()

    return {
      progress,
      isActiveTransition,
    }
  },
}
</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";

.content {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 99;
  &:hover {
    .progress {
      opacity: 1;
    }
  }
}
</style>
