<template>
  <div :class="$style.controlBtn">

    <div class="my__button" aria-label="收藏" @click="addMusicTo">
      <PhHeart size="52%" weight="regular" />
    </div>

    <div :class="[$style.list, 'my__button']" aria-label="播放列表" @click="togglePlaylistPopup">
      <svg t="1769493815060" height="54%" width="54%" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="112" y="185" width="400" height="80" fill="currentColor" />
        <rect x="112" y="467" width="800" height="80" fill="currentColor" />
        <rect x="112" y="749" width="520" height="80" fill="currentColor" />
      </svg>
    </div>

    <div ref="dom_menuBtn" aria-label="更多操作" class="my__button" @click.stop="showMenu">
      <PhDotsThreeVertical size="62%" weight="bold" />
    </div>
    <common-list-add-modal v-model:show="isShowAddMusicTo" :music-info="playMusicInfo.musicInfo || {}" />
    <PlaylistPopup v-model:show="isShowPlaylistPopup" />
    <base-menu v-model="isShowItemMenu" :menus="menus" :xy="menuLocation" item-name="name"
      @menu-click="handleMenuClick" />
    <music-toggle-modal v-if="playMusicInfo.musicInfo" v-model:show="isShowMusicToggleModal"
      :music-info="playMusicInfo.musicInfo" @toggle="toggleSource" />
    <common-download-modal v-if="playMusicInfo.musicInfo" v-model:show="isShowDownload"
      :music-info="playMusicInfo.musicInfo" teleport="#view" />
  </div>
</template>

<script>
import { ref, reactive, computed } from '@common/utils/vueTools'
import { clipboardWriteText, openUrl } from '@common/utils/electron'
import { useRouter } from '@common/utils/vueRouter'
import { useI18n } from '@renderer/plugins/i18n'
import musicSdk from '@renderer/utils/musicSdk'
import { toOldMusicInfo } from '@renderer/utils'
import { assertApiSupport } from '@renderer/store/utils'
import { updateListMusics } from '@renderer/store/list/listManage'
import { playList } from '@renderer/core/player'
import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
import { musicInfo, playMusicInfo, playInfo } from '@renderer/store/player/state'
import { appSetting } from '@renderer/store/setting'
import { lastFMTrackResult } from '@renderer/store'
import { PhDotsThreeVertical, PhHeart } from '@phosphor-icons/vue'
import PlaylistPopup from './PlaylistPopup.vue'
import MusicToggleModal from '@renderer/views/Library/Playlist/MusicList/components/MusicToggleModal.vue'

export default {
  components: {
    PhDotsThreeVertical,
    PhHeart,
    PlaylistPopup,
    MusicToggleModal,
  },
  setup() {
    const t = useI18n()
    const router = useRouter()
    const isShowAddMusicTo = ref(false)
    const isShowPlaylistPopup = ref(false)

    const isShowItemMenu = ref(false)
    const menuLocation = reactive({ x: 0, y: 0 })
    const isShowDownload = ref(false)
    const isShowMusicToggleModal = ref(false)

    const menus = computed(() => {
      const info = playMusicInfo.musicInfo
      return [
        {
          name: t('list__download'),
          action: 'download',
          disabled: !info || !assertApiSupport(info.source),
        },
        {
          name: t('list__toggle_source'),
          action: 'toggleSource',
          disabled: !info,
        },
        {
          name: t('list__copy_name'),
          action: 'copyName',
          disabled: !info,
        },
        {
          name: t('list__source_detail'),
          action: 'sourceDetail',
          disabled: !info || !musicSdk[info.source]?.getMusicDetailPageUrl,
        },
        {
          name: t('list__search'),
          action: 'search',
          disabled: !info,
        },
      ]
    })

    const dom_menuBtn = ref(null)

    const showMenu = () => {
      if (!dom_menuBtn.value) return
      const rect = dom_menuBtn.value.getBoundingClientRect()
      menuLocation.x = rect.right
      menuLocation.y = rect.top - 220
      isShowItemMenu.value = true
    }

    const handleMenuClick = (action) => {
      isShowItemMenu.value = false
      if (!action) return
      const info = playMusicInfo.musicInfo
      switch (action.action) {
        case 'download':
          isShowDownload.value = true
          break
        case 'toggleSource':
          isShowMusicToggleModal.value = true
          break
        case 'copyName':
          clipboardWriteText(appSetting['download.fileName'].replace('歌名', info.name).replace('歌手', info.singer))
          break
        case 'sourceDetail': {
          const url = musicSdk[info.source]?.getMusicDetailPageUrl(toOldMusicInfo(info))
          if (url) openUrl(url)
          break
        }
        case 'search':
          router.push({
            path: '/search',
            query: {
              text: `${info.name} ${info.singer}`,
            },
          })
          break
      }
    }

    const toggleSource = (toggleMusicInfo) => {
      const info = playMusicInfo.musicInfo
      if (!info) return
      const listId = playMusicInfo.listId
      if (!listId) return

      const newMusicInfo = {
        ...info,
        meta: {
          ...info.meta,
          toggleMusicInfo,
        },
      }

      updateListMusics([{ id: listId, musicInfo: newMusicInfo }])

      // Update the cache if needed? listManage usually updates cache.
      // But useMusicToggle.js did manual cache update:
      // const rawInfo = getListMusicsFromCache(props.listId)[index]
      // rawInfo.meta.toggleMusicInfo = toggleMusicInfo
      // This suggests updateListMusics might not be synchronous or sufficient for immediate replay?
      // Or maybe it updates the persistent store but we need to update the running player instance's view of the list??
      // But playList(listId, index) should pull from the list.

      // I'll try just playing the list index again.
      // But I need the index. playMusicInfo.playIndex is available.

      updateListMusics([{ id: listId, musicInfo: newMusicInfo }])

      playList(listId, playInfo.playerPlayIndex)
      isShowMusicToggleModal.value = false
    }

    const {
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    } = useToggleDesktopLyric()
    const addMusicTo = () => {
      if (!musicInfo.id) return
      isShowAddMusicTo.value = true
    }
    const togglePlaylistPopup = () => {
      isShowPlaylistPopup.value = !isShowPlaylistPopup.value
    }
    const openLastFM = () => {
      window.open('https://www.last.fm/user/' + appSetting['lastFM.session.name'])
    }
    return {
      appSetting,
      isShowAddMusicTo,
      isShowPlaylistPopup,
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
      addMusicTo,
      togglePlaylistPopup,
      playMusicInfo,
      lastFMTrackResult,
      openLastFM,
      menus,
      isShowItemMenu,
      menuLocation,
      showMenu,
      handleMenuClick,
      isShowDownload,
      isShowMusicToggleModal,
      toggleSource,
      dom_menuBtn,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.list {
  svg {}
}

.last-fm {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 6px;
  border-radius: 10px;
  transition: all .15s ease;

  &:hover {
    background-color: var(--color-primary-alpha-900);
  }

  .lastFmSvg {
    color: var(--color-primary)
  }

  .username {
    margin-left: 6px;
  }

  .loader {
    animation: spin 1.25s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.controlBtn {
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  gap: 15px;
  align-items: center;

  button {
    color: var(--color-1000);
  }
}

.titleBtn {
  flex: none;
  height: 100%;
  width: 24px;
  transition: @transition-fast;
  transition-property: color, opacity;
  // color: var(--color-button-font);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  width: 24px;
  padding: 0;

  opacity: .6;
  cursor: pointer;

  svg {
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 1;
  }
}
</style>
