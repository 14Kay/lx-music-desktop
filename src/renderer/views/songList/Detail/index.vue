<template>
  <div :class="$style.container">
    <common-playlist-info :class="$style.info" :list-id="fullListId" :author="listDetailInfo.info.author"
      :cover="picUrl || listDetailInfo.info.img" :description="listDetailInfo.info.desc"
      :title="listDetailInfo.info.name" :count="listDetailInfo.total" :is-collected="isCollected" @play="handlePlay"
      @collect="handleCollect" @search="handleSearch" />
    <div :class="$style.musicList">
      <material-online-list ref="listRef" :page="listDetailInfo.page" :limit="listDetailInfo.limit"
        :total="listDetailInfo.total" :list="listDetailInfo.list" :no-item="listDetailInfo.noItemLabel"
        :search="searchContent" @play-list="handlePlayList" @toggle-page="togglePage" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from '@common/utils/vueTools'
import { useRoute } from '@common/utils/vueRouter'
import { addSongListDetail, playSongListDetail, isAlreadyExists, removeSongListDetail } from './action'
import useList from './useList'
import { appSetting } from '@renderer/store/setting'

const source = ref<LX.OnlineSource>('kw')
const id = ref<string>('')
const page = ref<number>(1)
const picUrl = ref<string>('')
const refresh = ref<boolean>(false)
const isCollected = ref<boolean>(false)
const searchContent = ref<string>('')

const randomFrom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

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

    const handlePlay = () => {
      let index = 0
      if (appSetting['player.togglePlayMethod'] === 'random' || appSetting['player.togglePlayMethod'] === 'singleLoop') {
        index = randomFrom(0, listDetailInfo.list.length - 1)
      }
      playSongListDetail(listDetailInfo.id, listDetailInfo.source, listDetailInfo.list, index)
    }

    const handleCollect = async () => {
      if (!isAlreadyExists(listDetailInfo.id, listDetailInfo.source)) {
        await addSongListDetail(listDetailInfo.id, listDetailInfo.source, listDetailInfo.info.name, picUrl.value || listDetailInfo.info.img)
        isCollected.value = true
      } else {
        removeSongListDetail(listDetailInfo.id, listDetailInfo.source)
        isCollected.value = false
      }
    }

    watch([source, id, page, refresh], async ([_source, _id, _page, _refresh]) => {
      isCollected.value = isAlreadyExists(_id, _source)
      void getListData(_source, _id, _page, _refresh)
    }, {
      immediate: true,
    })
    const handleSearch = (content: string) => {
      if (content.trim() === searchContent.value.trim()) return
      searchContent.value = content.toLowerCase().trim()
    }

    const fullListId = computed(() => {
      return `${listDetailInfo.source}__${listDetailInfo.id}`
    })

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
      handlePlay,
      fullListId,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.musicList {
  width: calc(100% - 200px);
  margin-left: 200px;
  padding-left: @gap;
  padding-bottom: @gap;
}

.container {
  padding-top: @gap;
  display: flex;
  position: relative;
  height: 100%;
  overflow: hidden;

  width: 100%;

  .info {
    width: 200px;
    position: fixed;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
