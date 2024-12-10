<template>
  <div>
    <div>
      <common-cover
        :image-url="cover ? resizeImage(cover, 224) : ''"
        :is-my-playlist="isMyPlaylist"
        :play-button-size="playButtonSize"
        :source="source"
        :from-name="fromName"
        @play="play"
        @goto="goTo"
      />
    </div>
    <div :class="$style.text">
      <div :class="$style.title">{{ title }}</div>
      <div v-if="subtitle" :class="$style.info">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from '@common/utils/vueRouter'
import { playList } from '@renderer/core/player'
import useList from './../../views/songList/Detail/useList'
import { resizeImage } from '@renderer/utils/resizeCover'

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

const play = async() => {
  if (!props.source) {
    playList(props.listId, randomFrom(0, Number(props.count) - 1))
  } else {
    const { getListData, handlePlayList } = useList()
    await getListData(props.source, props.listId, 1, false)
    handlePlayList(0)
    /* playSongListDetail(props.id, props.source as LX.OnlineSource, listDetailInfo.list, 0) */
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
  }
}
</style>
