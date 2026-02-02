<template>
  <div :class="[$style.sliderContent, { [$style.disabled]: disabled, [$style.vertical]: vertical }, className]"
    :style="vertical ? { height: height + 'px' } : { width: width + 'px' }">
    <div :class="[$style.slider]">
      <div ref="dom_sliderBar" :class="$style.sliderBar"
        :style="{ transform: `scale${vertical ? 'Y' : 'X'}(${(value - min) / (max - min) || 0})` }" />
    </div>
    <div :class="$style.sliderDot" :style="vertical
      ? { bottom: `${((value - min) / (max - min) || 0) * 100}%` }
      : { left: `${((value - min) / (max - min) || 0) * 100}%` }" />
    <div v-show="showText" :class="$style.value" :style="vertical
      ? { bottom: `${Math.trunc(value * 100) + '%'}` }
      : { left: `${Math.trunc(value * 100) + '%'}` }">
      {{ Math.trunc(value * 100) }}%
    </div>
    <div :class="$style.sliderMask" @mousedown="handleSliderMsDown" />
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from '@common/utils/vueTools'
// import { player as eventPlayerNames } from '@renderer/event/names'

export default {
  props: {
    className: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const sliderEvent = {
      isMsDown: false,
      msDownX: 0,
      msDownValue: 0,
    }
    const dom_sliderBar = ref(null)
    const showText = ref(false)

    const handleSliderMsDown = event => {
      if (props.disabled) return

      sliderEvent.isMsDown = true
      if (props.vertical) {
        sliderEvent.msDownY = event.clientY
        sliderEvent.msDownValue = 1 - (event.offsetY / dom_sliderBar.value.clientHeight)
      } else {
        sliderEvent.msDownX = event.clientX
        sliderEvent.msDownValue = event.offsetX / dom_sliderBar.value.clientWidth
      }

      let val = sliderEvent.msDownValue * (props.max - props.min) + props.min
      if (val < props.min) val = props.min
      if (val > props.max) val = props.max
      emit('change', val)
      showText.value = true
      // if (isMute.value) window.app_event.setSliderIsMute(false)
    }
    const handleSliderMsUp = () => {
      sliderEvent.isMsDown = false
      showText.value = false
    }
    const handleSliderMsMove = event => {
      if (!sliderEvent.isMsDown || props.disabled) return
      let value
      if (props.vertical) {
        value = (sliderEvent.msDownValue - (event.clientY - sliderEvent.msDownY) / dom_sliderBar.value.clientHeight) * (props.max - props.min) + props.min
      } else {
        value = (sliderEvent.msDownValue + (event.clientX - sliderEvent.msDownX) / dom_sliderBar.value.clientWidth) * (props.max - props.min) + props.min
      }
      if (value > props.max) value = props.max
      else if (value < props.min) value = props.min
      emit('change', value)
    }

    document.addEventListener('mousemove', handleSliderMsMove)
    document.addEventListener('mouseup', handleSliderMsUp)
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', handleSliderMsMove)
      document.removeEventListener('mouseup', handleSliderMsUp)
    })

    return {
      handleSliderMsDown,
      dom_sliderBar,
      showText,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.value {
  position: absolute;
  left: 0%;
  top: -150%;
  transform: translateX(-50%);
  font-size: 12px;
  text-align: left;
}

.sliderContent {
  flex: none;
  position: relative;
  padding: 4px 0;
  // margin-right: 10px;
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity @transition-normal;

  &:hover {
    opacity: 1;

    .sliderBar {
      background-color: var(--color-primary);
    }
  }

  &.disabled {
    opacity: .3;

    .sliderMask {
      cursor: default;
    }
  }
}

.slider {
  // cursor: pointer;
  width: 100%;
  height: 4px;
  border-radius: 20px;
  overflow: hidden;
  transition: @transition-normal;
  transition-property: background-color, opacity;
  background-color: var(--color-100);
  // background-color: #f5f5f5;
  position: relative;
  // border-radius: @radius-progress-border;
}

// .muted {
//   opacity: .5;
// }

.sliderBar {
  position: absolute;
  left: 0;
  top: 0;
  transform: scaleX(0);
  transform-origin: 0;
  transition-property: transform;
  transition-timing-function: ease;
  width: 100%;
  height: 100%;
  // border-radius: @radius-progress-border;
  background-color: var(--color-primary);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.sliderDot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-primary);
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  transition: opacity @transition-fast;
  pointer-events: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.sliderContent:hover .sliderDot {
  opacity: 1;
}

.sliderMask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.vertical {
  flex-direction: column;
  padding: 0 4px;

  .slider {
    width: 4px;
    height: 100%;
  }

  .sliderBar {
    transform-origin: bottom;
  }

  .sliderDot {
    top: auto;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .value {
    left: auto;
    top: auto;
    right: 200%;
    bottom: 0;
    transform: translateY(50%);
  }
}
</style>
