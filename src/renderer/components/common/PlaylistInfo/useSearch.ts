import { nextTick, type Ref } from '@common/utils/vueTools'
import { inject, onMounted, onBeforeUnmount } from 'vue'

export default ({ content, searchWidth, container_dom, emit }: {
  content: Ref<string>
  searchWidth: Ref<number>
  container_dom: Ref<HTMLInputElement | null>
  emit: (event: 'search' | 'play' | 'collect' | 'delete', content: string) => void
}) => {
  const handleSearch = () => {
    searchWidth.value = 200
    const dom = container_dom.value
    if (!dom) return
    void nextTick(() => {
      dom.querySelector('input')?.focus()
    })
  }
  const $bus = inject<any>('$bus')

  const handleSearchAction = () => {
    emit('search', content.value)
  }

  const handleSearchFocus = () => {
    searchWidth.value = 200
  }

  const handleOnPageClick = () => {
    searchWidth.value = 85
  }
  onMounted(() => {
    $bus.on('click', handleOnPageClick)
  })
  onBeforeUnmount(() => {
    $bus.off('click', handleOnPageClick)
  })

  return {
    handleSearch,
    handleSearchAction,
    handleSearchFocus,
  }
}
