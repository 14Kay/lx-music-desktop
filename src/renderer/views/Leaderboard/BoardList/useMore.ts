import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useMore(domRef: Ref<HTMLElement | null>) {
  const height = ref(0)
  let resizeObserver: ResizeObserver | null = null

  const updateWidth = () => {
    if (domRef.value) {
      height.value = domRef.value.offsetHeight
    }
  }

  onMounted(() => {
    if (domRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateWidth()
      })
      resizeObserver.observe(domRef.value)
      updateWidth()
    }
  })

  onUnmounted(() => {
    if (resizeObserver && domRef.value) {
      resizeObserver.unobserve(domRef.value)
    }
  })

  return {
    height,
  }
}
