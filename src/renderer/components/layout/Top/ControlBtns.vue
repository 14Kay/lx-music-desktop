<template>
    <div v-show="!isFullscreen" ref="dom_btns" :class="$style.controlBtn">
        <!-- 黑夜模式切换按钮 -->
        <button type="button" :class="[$style.btn, $style.darkMode]"
            :aria-label="darkMode.enabled ? '切换到日间模式' : '切换到黑夜模式'" ignore-tip
            :title="darkMode.enabled ? '切换到日间模式' : '切换到黑夜模式'" @click="handleDarkModeToggle">
            <PhMoon v-if="!darkMode.enabled" :size="14" weight="fill" />
            <PhSun v-else :size="14" weight="fill" />
        </button>


        <button type="button" :class="[$style.btn, $style.close]" :aria-label="$t('close')" ignore-tip
            :title="$t('close')" @click="closeWindow">
            <svg :class="$style.controlBtniIcon" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
                <use xlink:href="#icon-window-close" />
            </svg>
        </button>
        <button type="button" :class="[$style.btn, $style.min]" :aria-label="$t('min')" ignore-tip :title="$t('min')"
            @click="minWindow">
            <svg :class="$style.controlBtniIcon" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
                <use xlink:href="#icon-window-minimize" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { minWindow, closeWindow } from '@renderer/utils/ipc'
import { onMounted, onBeforeUnmount, ref, useCssModule } from '@common/utils/vueTools'
import { isFullscreen } from '@renderer/store'
import { PhMoon, PhSun } from '@phosphor-icons/vue'
import { darkMode, toggleDarkMode } from '@renderer/store/theme/state'

const dom_btns = ref()

const cssModule = useCssModule()

const handle_focus = () => {
    if (!dom_btns.value) return
    dom_btns.value.classList.remove(cssModule.hover)
}
const handle_mouseenter = () => {
    dom_btns.value.classList.add(cssModule.hover)
}
const handle_mouseleave = () => {
    dom_btns.value.classList.remove(cssModule.hover)
}

const handleDarkModeToggle = () => {
    console.log('Dark mode button clicked!')
    toggleDarkMode()
}

onMounted(() => {
    window.app_event.on('focus', handle_focus)
    dom_btns.value.addEventListener('mouseenter', handle_mouseenter)
    dom_btns.value.addEventListener('mouseleave', handle_mouseleave)
})

onBeforeUnmount(() => {
    window.app_event.off('focus', handle_focus)
    dom_btns.value.removeEventListener('mouseenter', handle_mouseenter)
    dom_btns.value.removeEventListener('mouseleave', handle_mouseleave)
})

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

@control-btn-width: @height-toolbar * .26;
@control-btn-height: 6%;

.controlBtn {
    box-sizing: border-box;
    padding: 0 7px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: @control-btn-height;
    -webkit-app-region: no-drag;
    opacity: .5;
    transition: opacity @transition-normal;

    &.hover {
        opacity: .8;

        .controlBtniIcon {
            opacity: 1;
        }
    }

}

.btn {
    position: relative;
    width: @control-btn-width;
    height: @control-btn-width;
    background: none;
    border: none;
    display: flex;
    // justify-content: center;
    // align-items: center;
    outline: none;
    padding: 1px;
    cursor: pointer;
    border-radius: 50%;
    color: var(--color-font);

    &.darkMode {
        background-color: var(--color-primary);
        color: var(--color-main-background);
    }

    &.min {
        background-color: var(--color-btn-min);
    }

    // &.max {
    //   background-color: var(--color-btn-max);
    // }
    &.close {
        background-color: var(--color-btn-close);
    }
}

.controlBtniIcon {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}
</style>
