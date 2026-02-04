<template>
  <div :class="$style.content">
    <canvas ref="dom_canvas" :class="$style.canvas" />
  </div>
</template>

<script>
import { ref, onBeforeUnmount, onMounted } from '@common/utils/vueTools'
import { getAnalyser } from '@renderer/plugins/player'
import { isPlay } from '@renderer/store/player/state'
// import { appSetting } from '@renderer/store/setting'

// const themes = {
//   green: 'rgba(77,175,124,.16)',
//   blue: 'rgba(52,152,219,.16)',
//   yellow: 'rgba(233,212,96,.22)',
//   orange: 'rgba(245,171,53,.16)',
//   red: 'rgba(214,69,65,.12)',
//   pink: 'rgba(241,130,141,.16)',
//   purple: 'rgba(155,89,182,.14)',
//   grey: 'rgba(108,122,137,.16)',
//   ming: 'rgba(51,110,123,.14)',
//   blue2: 'rgba(79,98,208,.14)',
//   black: 'rgba(39,39,39,.4)',
//   mid_autumn: 'rgba(74,55,82,.1)',
//   naruto: 'rgba(87,144,167,.15)',
//   happy_new_year: 'rgba(192,57,43,.1)',
// }

const getBarWidth = canvasWidth => {
  let barWidth = (canvasWidth / 128) * 2.5
  const width = canvasWidth / 86
  const diffWidth = barWidth - width
  // console.log(barWidth - width)
  // if (barWidth - width > 20) newBarWidth = 20
  // barWidth = newBarWidth
  return diffWidth > 32
    ? canvasWidth / 128 // 4k屏、超宽屏直接显示所有频谱条
    : diffWidth > 12 ? width : barWidth
}
export default {
  props: {
    color: {
      type: String,
      default: '',
    },
    barCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const dom_canvas = ref(null)
    const analyser = getAnalyser()

    let ctx
    let bufferLength = 0
    let dataArray
    let WIDTH
    let HEIGHT
    let barWidth
    let barHeight
    let x = 0
    let isPlaying = false
    let animationFrameId
    let resizeObserver

    let num
    let mult
    const maxNum = 255
    let frequencyAvg = 0

    let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-font-secondary')

    const renderFrame = () => {
      x = 0

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = props.color || themeColor

      if (props.barCount > 0) {
        // We limit to the first ~16kHz to ensure consistency across sample rates (44.1k vs 48k)
        // and to avoid empty bars at the end for compressed audio.
        const sampleRate = analyser.context.sampleRate
        const nyquist = sampleRate / 2
        // Cap at 16kHz or Nyquist, whichever is smaller. 16kHz is a good limit for MP3s.
        const maxFreq = Math.min(16000, nyquist)
        const effectiveBufferLength = Math.floor(bufferLength * (maxFreq / nyquist))

        const step = effectiveBufferLength / props.barCount
        const dpr = window.devicePixelRatio || 1

        const actualBarWidth = WIDTH / props.barCount

        for (let i = 0; i < props.barCount; i++) {
          let sum = 0
          const start = Math.floor(i * step)
          const end = Math.floor((i + 1) * step)
          const count = end - start

          if (count > 0) {
            for (let j = start; j < end; j++) {
              sum += dataArray[j]
            }
            barHeight = (sum / count / 255) * HEIGHT
          } else {
            // Fallback for when step < 1 (low buffer size or high bar count)
            barHeight = (dataArray[start] / 255) * HEIGHT
            if (start >= dataArray.length) barHeight = 0
          }

          // Boost high frequencies slightly as they naturally have less energy
          // 1.0 at bass -> 1.8 at treble
          const boost = 1 + (i / props.barCount) * 0.8
          barHeight *= boost

          const xPos = i * actualBarWidth
          // Draw with overlap to prevent gaps, scaled by DPR
          ctx.fillRect(xPos, HEIGHT - barHeight, actualBarWidth + 0.5 * dpr, barHeight)
        }
      } else {
        // legacy render logic
        for (let i = 0; i < bufferLength; i++) {
          mult = Math.floor(i / maxNum)
          num = mult % 2 === 0 ? (i - maxNum * mult) : (maxNum - (i - maxNum * mult))
          let spectrum = num > 90 ? 0 : dataArray[num + 20]
          frequencyAvg += spectrum * 1.2
        }
        frequencyAvg /= bufferLength
        frequencyAvg *= 1.4

        frequencyAvg = frequencyAvg / maxNum

        for (let i = 0; i < bufferLength; i++) {
          if (x > WIDTH) break

          barHeight = dataArray[i]

          // Simplified legacy height calculation logic
          barHeight = (barHeight * frequencyAvg + barHeight * 0.42) * (HEIGHT * 0.5 / 255)
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

          x += barWidth
        }
      }

      animationFrameId = null
      if (isPlaying) animationFrameId = window.requestAnimationFrame(renderFrame)
    }

    const handlePlay = () => {
      isPlaying = true
      bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)

      handleResize() // Ensure update dimensions/buffers on play
      renderFrame()
    }
    const handlePause = () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
      isPlaying = false
    }

    const handleResize = () => {
      const canvas = dom_canvas.value
      if (!canvas) return

      const dpr = window.devicePixelRatio || 1
      const clientWidth = canvas.clientWidth
      const clientHeight = canvas.clientHeight

      // Update canvas resolution for High DPI
      if (canvas.width !== clientWidth * dpr || canvas.height !== clientHeight * dpr) {
        canvas.width = clientWidth * dpr
        canvas.height = clientHeight * dpr
      }

      WIDTH = canvas.width
      HEIGHT = canvas.height

      if (props.barCount > 0) {
        // barWidth dynamically calc in renderFrame
      } else {
        barWidth = getBarWidth(WIDTH)
      }
    }

    window.app_event.on('play', handlePlay)
    window.app_event.on('pause', handlePause)
    window.app_event.on('error', handlePause)
    // Use ResizeObserver instead of window resize for better accuracy

    onBeforeUnmount(() => {
      handlePause()
      window.app_event.off('play', handlePlay)
      window.app_event.off('pause', handlePause)
      window.app_event.off('error', handlePause)
      if (resizeObserver) resizeObserver.disconnect()
    })

    onMounted(() => {
      const canvas = dom_canvas.value
      ctx = canvas.getContext('2d')

      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(canvas)

      handleResize()

      if (isPlay.value) handlePlay()
    })

    return {
      dom_canvas,
    }
  },
}
</script>

<style lang="less" module>
.content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  right: 0;
  bottom: 0;
}

.canvas {
  width: 100%;
  height: 100%;
  // opacity: 0.1;
}
</style>
