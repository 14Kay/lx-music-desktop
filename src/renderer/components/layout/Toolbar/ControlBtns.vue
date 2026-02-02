<template>
  <div ref="dom_btns" :class="$style.control">
    <button type="button" :class="[$style.btn, $style.min, 'my__button']" :aria-label="$t('min')" ignore-tip
      :title="$t('min')" @click="minWindow">
      <PhMinus size="60%" weight="bold" />
    </button>
    <button type="button" :class="[$style.btn, $style.close, 'my__button']" :aria-label="$t('close')" ignore-tip
      :title="$t('close')" @click="closeWindow">
      <PhX size="60%" weight="bold" />
    </button>
  </div>
</template>

<script setup>
import { minWindow, closeWindow } from '@renderer/utils/ipc'
import { onMounted, onBeforeUnmount, ref, useCssModule } from '@common/utils/vueTools'
// import { getRandom } from '../../utils'
import { PhX, PhMinus } from '@phosphor-icons/vue'

const dom_btns = ref()

const cssModule = useCssModule()

console.log(cssModule.hover)
const handle_focus = () => {
  if (!dom_btns.value) return
  for (const node of dom_btns.value.childNodes) {
    if (node.tagName != 'BUTTON') continue
    node.classList.remove(cssModule.hover)
  }
}

const getBtnEl = (el) => !el || el.tagName == 'BUTTON' ? el : getBtnEl(el.parentNode)
const handle_mouseover = (event) => {
  const btn = getBtnEl(event.target)
  if (!btn) return
  btn.classList.add(cssModule.hover)
}
const handle_mouseout = (event) => {
  const btn = getBtnEl(event.target)
  if (!btn) return
  btn.classList.remove(cssModule.hover)
}


onMounted(() => {
  window.app_event.on('focus', handle_focus)
  dom_btns.value.addEventListener('mouseover', handle_mouseover)
  dom_btns.value.addEventListener('mouseout', handle_mouseout)
})
onBeforeUnmount(() => {
  window.app_event.off('focus', handle_focus)
  dom_btns.value.removeEventListener('mouseover', handle_mouseover)
  dom_btns.value.removeEventListener('mouseout', handle_mouseout)
})

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.control {
  display: flex;
  align-self: flex-start;
  -webkit-app-region: no-drag;
  gap: 15px;

  .btn {
    background-color: transparent;
    cursor: pointer;

    &.hover {

      &.min,
      &.max {
        background-color: var(--color-primary);
        border: 1px solid var(--color-primary);
        color: #fff;
      }

      &.close {
        background-color: #E81123;
        border: 1px solid #E81123;
        color: #fff;
      }
    }
  }
}
</style>
