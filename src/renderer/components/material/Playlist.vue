<template>
  <div>
    <div>
      <common-cover :image-url="cover ? resizeImage(cover, 224) : ''" :is-my-playlist="isMyPlaylist"
        :play-button-size="playButtonSize" :source="source" :from-name="fromName" :is-playing="isPlayingCurrentPlaylist"
        @play="handlePlayPause" @goto="goTo" />
    </div>
    <div :class="$style.text">
      <div :class="$style.title">{{ title }}</div>
      <div v-if="subtitle" :class="$style.info">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from '@common/utils/vueRouter'
import { playList, pause } from '@renderer/core/player'
import useList from './../../views/songList/Detail/useList'
import { resizeImage } from '@renderer/utils/resizeCover'
import { appSetting } from '@renderer/store/setting'
import { playMusicInfo, isPlay } from '@renderer/store/player/state'
import { tempListMeta } from '@renderer/store/list/state'
import { LIST_IDS } from '@common/constants'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  listId: string
  cover: string
  playButtonSize?: number
  title: string
  subtitle?: string
  isMyPlaylist?: boolean
  count?: number | string
  source?: LX.OnlineSource | ''
  fromName?: string
}>(), {
  playButtonSize: 22,
  source: '',
  fromName: '',
  subtitle: '',
  isMyPlaylist: false,
  count: 0,
})

const randomFrom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
const router = useRouter()

// 生成完整的 listId 格式
const fullListId = computed(() => {
  if (!props.source) {
    return props.listId
  }
  return `${props.source}__${props.listId}`
})

// 检查是否正在播放当前歌单
const isPlayingCurrentPlaylist = computed(() => {
  const isDirectMatch = playMusicInfo.listId === fullListId.value
  const isTempMatch = playMusicInfo.listId === LIST_IDS.TEMP && tempListMeta.id === fullListId.value
  return (isDirectMatch || isTempMatch) && isPlay.value
})

const play = async () => {
  if (!props.source) {
    playList(props.listId, randomFrom(0, Number(props.count) - 1))
  } else {
    const { getListData, handlePlayList, listDetailInfo } = useList()
    await getListData(props.source, props.listId, 1, false)
    const index = appSetting['player.togglePlayMethod'] === 'random'
      ? randomFrom(0, listDetailInfo.list.length - 1)
      : 0
    handlePlayList(index)
  }
}

const handlePlayPause = () => {
  if (isPlayingCurrentPlaylist.value) {
    pause()
  } else {
    void play()
  }
}

const goTo = () => {
  const query = {
    id: props.listId,
    cover: props.cover,
  }
  if (props.isMyPlaylist) {
    Object.assign(query, {
      title: props.title,
      count: props.count,
    })
    void router.push({ path: '/library/playlist', query })
  } else {
    Object.assign(query, {
      source: props.source,
      picUrl: props.cover,
      fromName: props.fromName,
    })
    router.push({ path: '/songList/detail', query })
  }
}
</script>

<style lang="less" module>
.text {
  margin-top: 8px;

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .info {
    font-size: 12px;
    opacity: 0.68;
    line-height: 18px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-word;
    margin-top: 4px;
  }
}
</style>
