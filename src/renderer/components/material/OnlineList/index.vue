<template>
  <div :class="$style.songList">
    <!-- <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut"> -->
    <div :class="$style.list">
      <div :class="$style.content">
        <div v-show="!noItem && showMusicList.length > 0" ref="dom_listContent" :class="$style.content">
          <base-virtualized-list ref="listRef" :list="showMusicList" key-name="id" :item-height="listItemHeight" container-class="scroll" content-class="list" @contextmenu.capture="handleListRightClick">
            <template #default="{ item, index }">
              <div
                class="list-item" :class="[{ selected: rightClickSelectedIndex == index }, { active: selectedList.includes(item) }]"
                @click="handleListItemClick($event, index)" @contextmenu="handleListItemRightClick($event, index)"
              >
                <!-- <div class="list-item-cell no-select num" style="flex: 0 0 5%;" @click.stop>{{ index + 1 }}</div> -->
                <div :class="$style.songInfo" class="list-item-cell auto name">
                  <img :class="$style.cover" :src="resizeImage(item.meta.picUrl, 224)" alt="item.name" loading="lazy">
                  <div :class="$style.info">
                    <div :class="$style.title">
                      <span class="select name" :aria-label="item.name">{{ item.name }}</span>
                      <span v-if="item.meta._qualitys.flac24bit" class="no-select badge badge-theme-primary">{{ $t('tag__lossless_24bit') }}</span>
                      <span v-else-if="item.meta._qualitys.ape || item.meta._qualitys.flac || item.meta._qualitys.wav" class="no-select badge badge-theme-primary">{{ $t('tag__lossless') }}</span>
                      <span v-else-if="item.meta._qualitys['320k']" class="no-select badge badge-theme-secondary">{{ $t('tag__high_quality') }}</span>
                      <span v-if="sourceTag" class="no-select badge badge-theme-tertiary">{{ item.source }}</span>
                    </div>
                    <div :class="$style.subtitle">
                      <span class="select" :aria-label="item.singer">{{ item.singer }}</span>
                    </div>
                  </div>
                </div>
                <div class="list-item-cell" style="flex: 0 0 40%;"><span class="select" :aria-label="item.meta.albumName">{{ item.meta.albumName }}</span></div>
                <div :class="[$style.textRight]" class="list-item-cell" style="flex: 0 0 8%;">
                  <base-svg-icon v-show="!item.isExist" :class="$style.collection" icon-class="heart" @click="handleCollection(index)" />
                  <base-svg-icon v-show="item.isExist" :class="$style.collection" icon-class="heart-solid" @click="handleUnCollection(index)" />
                </div>
                <div :class="$style.textRight" class="list-item-cell" style="flex: 0 0 7%;"><span class="no-select">{{ item.interval || '--/--' }}</span></div>
              </div>
            </template>
            <template #footer>
              <div :class="$style.pagination">
                <material-pagination :count="total" :limit="limit" :page="page" @btn-click="$emit('togglePage', $event)" />
              </div>
            </template>
          </base-virtualized-list>
        </div>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div v-show="noItem || showMusicList.length == 0" :class="$style.noitem">
            <p>{{ $t('no_item') }}</p>
          </div>
        </transition>
      </div>
    </div>
    <!-- </transition> -->
    <!-- <material-flow-btn :show="isShowEditBtn && assertApiSupport(source)" :remove-btn="false" @btn-click="handleFlowBtnClick" /> -->
    <!-- <common-download-modal v-model:show="isShowDownload" :music-info="selectedDownloadMusicInfo" teleport="#view" />
    <common-download-multiple-modal v-model:show="isShowDownloadMultiple" :list="selectedList" teleport="#view" @confirm="removeAllSelect" /> -->
    <common-list-add-modal v-model:show="isShowListAdd" :music-info="selectedAddMusicInfo" teleport="#view" />
    <common-list-add-multiple-modal v-model:show="isShowListAddMultiple" :music-list="selectedList" teleport="#view" @confirm="removeAllSelect" />
    <common-download-modal v-model:show="isShowDownload" :music-info="selectedDownloadMusicInfo" teleport="#view" />
    <common-download-multiple-modal v-model:show="isShowDownloadMultiple" :list="selectedList" teleport="#view" @confirm="removeAllSelect" />
    <base-menu v-model="isShowItemMenu" :menus="menus" :xy="menuLocation" item-name="name" @menu-click="handleMenuClick" />
  </div>
</template>

<script>
import { clipboardWriteText } from '@common/utils/electron'
import { assertApiSupport } from '@renderer/store/utils'
import { ref, watch } from '@common/utils/vueTools'
import useList from './useList'
import useMenu from './useMenu'
import usePlay from './usePlay'
import useMusicDownload from './useMusicDownload'
import useMusicAdd from './useMusicAdd'
import useMusicActions from './useMusicActions'
import { appSetting } from '@renderer/store/setting'
import { addListMusics, getMusicExistListIds, removeListMusics } from '@renderer/store/list/action'
import { loveList } from '@renderer/store/list/state'

export default {
  name: 'MaterialOnlineList',
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    page: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    sourceTag: {
      type: Boolean,
      default: false,
    },
    noItem: {
      type: String,
      default: '',
    },
    checkApiSource: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
  },
  emits: ['show-menu', 'play-list', 'togglePage'],
  setup(props, { emit }) {
    const actionButtonsVisible = appSetting['list.actionButtonsVisible']
    const rightClickSelectedIndex = ref(-1)
    const dom_listContent = ref(null)
    const listRef = ref(null)
    // 源音乐列表
    const musicList = ref([])
    // 页面展示的音乐列表
    const showMusicList = ref([])

    const {
      selectedList,
      listItemHeight,
      handleSelectData,
      removeAllSelect,
    } = useList({ props, listRef })

    const {
      handlePlayMusic,
      handlePlayMusicLater,
      doubleClickPlay,
    } = usePlay({ selectedList, props, removeAllSelect, emit })

    const {
      isShowListAdd,
      isShowListAddMultiple,
      selectedAddMusicInfo,
      handleShowMusicAddModal,
    } = useMusicAdd({ selectedList, props })

    const {
      isShowDownload,
      isShowDownloadMultiple,
      selectedDownloadMusicInfo,
      handleShowDownloadModal,
    } = useMusicDownload({ selectedList, props })

    const {
      handleSearch,
      handleOpenMusicDetail,
      handleDislikeMusic,
    } = useMusicActions({ props })

    const {
      menus,
      menuLocation,
      isShowItemMenu,
      showMenu,
      menuClick,
    } = useMenu({
      props,
      assertApiSupport,
      emit,

      handleShowDownloadModal,
      handlePlayMusic,
      handlePlayMusicLater,
      handleSearch,
      handleShowMusicAddModal,
      handleOpenMusicDetail,
      handleDislikeMusic,
    })

    const handleListItemClick = (event, index) => {
      if (rightClickSelectedIndex.value > -1) return
      handleSelectData(index)
      doubleClickPlay(index)
    }
    const handleListItemRightClick = (event, index) => {
      rightClickSelectedIndex.value = index
      showMenu(event, props.list[index], index)
    }
    const handleMenuClick = (action) => {
      let index = rightClickSelectedIndex.value
      rightClickSelectedIndex.value = -1
      menuClick(action, index)
    }
    const handleListRightClick = (event) => {
      if (!event.target.classList.contains('select')) return
      event.stopImmediatePropagation()
      let classList = dom_listContent.value.classList
      classList.add('copying')
      window.requestAnimationFrame(() => {
        let str = window.getSelection().toString()
        classList.remove('copying')
        str = str.split(/\n\n/).map(s => s.replace(/\n/g, '  ')).join('\n').trim()
        if (!str.length) return
        clipboardWriteText(str)
      })
    }
    const handleListBtnClick = ({ action, index }) => {
      switch (action) {
        case 'download':
          handleShowDownloadModal(index, true)
          break
        case 'play':
          void handlePlayMusic(index, true)
          break
        case 'search':
          handleSearch(index)
          break
        case 'listAdd':
          handleShowMusicAddModal(index, true)
          break
      }
    }
    const scrollToTop = () => {
      listRef.value.scrollTo(0, true)
    }

    const handleCollection = (index) => {
      const item = musicList.value[index]
      addListMusics(loveList.id, [item])
      musicList.value[index].isExist = true
      musicList.value = [...musicList.value]
    }

    const handleUnCollection = (index) => {
      const item = musicList.value[index]
      removeListMusics({ listId: loveList.id, ids: [item.id] })
      musicList.value[index].isExist = false
      musicList.value = [...musicList.value]
    }

    const resizeImage = (imgUrl, size = 512) => {
      if (!imgUrl) return ''
      let httpsImgUrl = imgUrl
      if (imgUrl.slice(0, 5) !== 'https') {
        httpsImgUrl = 'https' + imgUrl.slice(4)
      }
      return `${httpsImgUrl}?param=${size}y${size}`
    }

    watch(() => props.list, async list => {
      musicList.value = []
      showMusicList.value = []
      const promises = list.map(async item => {
        const ids = await getMusicExistListIds(item.id)
        item.isExist = ids.includes(loveList.id)
      })
      await Promise.all(promises)
      musicList.value = list
      showMusicList.value = list
    }, {
      immediate: true,
    })


    watch(() => props.search, search => {
      const list = musicList.value.filter(item => item.name.toLowerCase().includes(search) || item.singer.toLowerCase().includes(search))
      showMusicList.value = list
    })

    return {
      listItemHeight,
      handleListItemClick,
      selectedList,
      handleListItemRightClick,
      removeAllSelect,
      handleListBtnClick,
      rightClickSelectedIndex,
      dom_listContent,
      listRef,

      menus,
      isShowItemMenu,
      menuLocation,
      handleMenuClick,

      handleListRightClick,
      assertApiSupport,

      isShowListAdd,
      isShowListAddMultiple,
      selectedAddMusicInfo,

      isShowDownload,
      isShowDownloadMultiple,
      selectedDownloadMusicInfo,

      scrollToTop,
      actionButtonsVisible,

      resizeImage,
      getMusicExistListIds,

      musicList,
      showMusicList,
      handleCollection,
      handleUnCollection,
    }
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.textRight{
  text-align: right;
}
.collection{
  cursor: pointer
}
.songInfo{
  display: flex;
  align-items: center;
  .info {
    margin-left: 10px;
  }
  .cover{
      height: 38px;
      width: 38px;
      border-radius: 4px;
      object-fit: cover;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  .subtitle {
    font-size: 12px;
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
}
.songList {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

.list {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  font-size: 14px;
}

.content {
  flex: auto;
  min-height: 0;
  position: relative;
  height: 100%;
}

.pagination {
  text-align: center;
  margin-top: 24px;
  padding: 15px 0;
  border-top: var(--color-list-header-border-bottom);
  // left: 50%;
  // transform: translateX(-50%);
}
.noitem {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  // background-color: var(--color-000);

  p {
    font-size: 24px;
    color: var(--color-font-label);
  }
}

</style>
