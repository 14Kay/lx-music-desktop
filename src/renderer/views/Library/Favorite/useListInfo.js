import { ref, watch, computed, onBeforeUnmount } from '@common/utils/vueTools'
import { playMusicInfo, playInfo, isPlay } from '@renderer/store/player/state'
import { getListMusics } from '@renderer/store/list/action'
import { appSetting } from '@renderer/store/setting'


export default ({ listId, maxCount }) => {
  const rightClickSelectedIndex = ref(-1)
  const selectedIndex = ref(-1)
  const dom_listContent = ref(null)
  const listRef = ref(null)
  const playing = ref(false)
  const count = ref(0)
  const excludeListIds = computed(() => ([listId]))
  const cover = ref('')

  const list = ref([])
  watch(() => listId, id => {
    getListMusics(id).then(l => {
      list.value = [...l]
      count.value = list.value.length
      if (list.value.length > maxCount) {
        list.value = list.value.slice(0, maxCount)
      }
      cover.value = list.value.find(item => item.meta && item.meta.picUrl)?.meta.picUrl
    })
  }, {
    immediate: true,
  })


  watch(() => isPlay.value, status => {
    playing.value = status
  }, {
    immediate: true,
  })

  const playerInfo = computed(() => ({
    isPlayList: playMusicInfo.listId == listId,
    playIndex: playInfo.playIndex,
  }))

  const setSelectedIndex = index => {
    selectedIndex.value = index
  }

  const isShowSource = computed(() => appSetting['list.isShowSource'])

  const handleMyListUpdate = (ids) => {
    if (!ids.includes(listId)) return
    getListMusics(listId).then(l => {
      list.value = [...l]
      count.value = list.value.length
      if (list.value.length > maxCount) {
        list.value = list.value.slice(0, maxCount)
      }
      cover.value = list.value.find(item => item.meta && item.meta.picUrl)?.meta.picUrl
    })
  }

  window.app_event.on('myListUpdate', handleMyListUpdate)

  onBeforeUnmount(() => {
    window.app_event.off('myListUpdate', handleMyListUpdate)
  })

  return {
    rightClickSelectedIndex,
    selectedIndex,
    dom_listContent,
    listRef,
    list,
    playerInfo,
    setSelectedIndex,
    isShowSource,
    excludeListIds,
    playing,
    count,
    cover,
  }
}
