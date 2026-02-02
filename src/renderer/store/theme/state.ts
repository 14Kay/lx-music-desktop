import { ref, watch } from '@common/utils/vueTools'

// 从 localStorage 读取暗色模式偏好
const getStoredDarkMode = (): boolean => {
    const stored = localStorage.getItem('lx-dark-mode')
    return stored === 'true'
}

// 更新 DOM 的 data-theme 属性
const updateTheme = (isDark: boolean) => {
    if (isDark) {
        document.documentElement.dataset.theme = 'dark'
    } else {
        delete document.documentElement.dataset.theme
    }
}

// 黑夜模式状态 (使用 ref 而不是 reactive)
export const isDarkMode = ref(getStoredDarkMode())

// 兼容原来的接口
export const darkMode = {
    get enabled() {
        return isDarkMode.value
    },
    set enabled(val: boolean) {
        isDarkMode.value = val
    }
}

// 监听状态变化，自动保存到 localStorage 并更新 DOM
watch(isDarkMode, (newValue) => {
    localStorage.setItem('lx-dark-mode', String(newValue))
    updateTheme(newValue)
    console.log('Dark mode changed to:', newValue) // 添加日志用于调试
}, { immediate: true })

// 切换黑夜模式
export const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    console.log('Toggle dark mode, new value:', isDarkMode.value) // 添加日志用于调试
}
