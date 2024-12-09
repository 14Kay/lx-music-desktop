<template>
  <div :class="$style.container">
    <common-playlist-info
    :list-id="listDetailInfo.id"
    :author="listDetailInfo.info.author"
    :cover="picUrl || listDetailInfo.info.img"
    :description="listDetailInfo.info.desc"
    :title="listDetailInfo.info.name"
    :count="listDetailInfo.total"
    :is-collected="isCollected"
    @play="playSongListDetail(listDetailInfo.id, listDetailInfo.source, listDetailInfo.list)"
    @collect="handleCollect"
    @search="handleSearch"
    />
    <div :class="$style.list">
      <material-online-list
        ref="listRef"
        :page="listDetailInfo.page"
        :limit="listDetailInfo.limit"
        :total="listDetailInfo.total"
        :list="listDetailInfo.list"
        :no-item="listDetailInfo.noItemLabel"
        :search="searchContent"
        @play-list="handlePlayList"
        @toggle-page="togglePage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from '@common/utils/vueTools'
import { useRoute } from '@common/utils/vueRouter'
import { addSongListDetail, playSongListDetail, isAlreadyExists, removeSongListDetail } from './action'
import useList from './useList'

const source = ref<LX.OnlineSource>('kw')
const id = ref<string>('')
const page = ref<number>(1)
const picUrl = ref<string>('')
const refresh = ref<boolean>(false)
const isCollected = ref<boolean>(false)
const searchContent = ref<string>('')

interface Query {
  source?: string
  id?: string
  page?: string
  picUrl?: string
  refresh?: 'true'
  fromName?: string
}

export default {
  setup() {
    const route = useRoute()
    const queryParams = route.query as Query
    let _source = queryParams.source
    let _id = queryParams.id
    let _page: string | undefined = queryParams.page
    let _picUrl: string | undefined = queryParams.picUrl
    let _refresh: 'true' | undefined = queryParams.refresh

    source.value = _source as LX.OnlineSource
    id.value = _id ?? ''
    page.value = _page ? parseInt(_page) : 1
    picUrl.value = _picUrl ?? ''
    refresh.value = _refresh ? _refresh == 'true' : false
    if (queryParams.fromName) window.lx.songListInfo.fromName = queryParams.fromName
    const {
      listRef,
      listDetailInfo,
      getListData,
      handlePlayList,
    } = useList()

    const togglePage = (page: number) => {
      void getListData(source.value, id.value, page, refresh.value)
    }

    const handleCollect = async() => {
      if (!isAlreadyExists(listDetailInfo.id, listDetailInfo.source)) {
        await addSongListDetail(listDetailInfo.id, listDetailInfo.source, listDetailInfo.info.name, picUrl.value || listDetailInfo.info.img)
        isCollected.value = true
      } else {
        removeSongListDetail(listDetailInfo.id, listDetailInfo.source)
        isCollected.value = false
      }
    }

    watch([source, id, page, refresh], async([_source, _id, _page, _refresh]) => {
      console.log(_source, _id, _page, _refresh)
      isCollected.value = isAlreadyExists(_id, _source)
      void getListData(_source, _id, _page, _refresh)
    }, {
      immediate: true,
    })
    const handleSearch = (content: string) => {
      if (content.trim() === searchContent.value.trim()) return
      searchContent.value = content.toLowerCase().trim()
    }
    return {
      source,
      id,
      page,
      picUrl,
      listDetailInfo,
      listRef,
      togglePage,
      addSongListDetail,
      playSongListDetail,
      handlePlayList,

      isCollected,
      handleCollect,
      searchContent,
      handleSearch,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.container {
  // position: absolute;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100%;
  padding-top: 24px;
  display: flex;
  flex-flow: column nowrap;
}

.songListHeader {
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  height: 80px;
}
.songListHeaderLeft {
  flex: none;
  margin-left: 15px;
  height: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-position: center;
  background-size: cover;
  opacity: .9;
  box-shadow: 0 0 2px 0 rgba(0,0,0,.2);
}
.playNum {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 12px;
  text-align: right;
  .mixin-ellipsis-1;
}

.songListHeaderMiddle {
  flex: auto;
  padding: 2px 7px;
  min-width: 0;
  h3 {
    .mixin-ellipsis-1;
    line-height: 1.2;
    padding-bottom: 5px;
    color: var(--color-font);
  }
  p {
    .mixin-ellipsis(3);
    font-size: 12px;
    line-height: 1.2;
    color: var(--color-font-label);
  }
}
.songListHeaderRight {
  flex: none;
  display: flex;
  align-items: center;
  padding-right: 15px;

  .headerRightBtn {
    border-radius: 0;
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}

.list {
  position: relative;
  width: 100%;
  min-height: 0;
  flex: auto;
  height: 100%;
  margin-top: 32px;
}
</style>

