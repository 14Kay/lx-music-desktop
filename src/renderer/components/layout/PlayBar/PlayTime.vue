<template>
  <div :class="$style.content">
    <div ref="dom_btn" :class="$style.timeContent">
      <span>{{ nowPlayTimeStr }}</span>
      <span style="margin: 0 1px;">/</span>
      <span>{{ maxPlayTimeStr }}</span>
    </div>
  </div>
</template>

<script>
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'

export default {
  setup() {
    const {
      nowPlayTimeStr,
      maxPlayTimeStr,
    } = usePlayProgress()

    return {
      nowPlayTimeStr,
      maxPlayTimeStr,
    }
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.content {
  position: relative;
  height: 24px;
  line-height: 24px;
}
.timeContent {
  // width: 30%;
  position: relative;
  // flex: none;
  color: var(--color-550);
  font-size: 13px;
}
</style>
