<template>
  <div>
    <div :style="listStyles" :class="$style.recent">
      <h2 class="my__title"><span>RECENTLY PLAYED</span></h2>
      <ListItem v-for="(item, index) in recentlyPlayedList" :key="item.musicId + '_' + index"
        :cover="item.meta?.picUrl || item.meta?.albumImg || ''" :name="item.name" :singer="item.singer"
        @dblclick="handlePlay(item)" />
      <div v-if="recentlyPlayedList.length === 0" :class="$style.empty">暂无播放记录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListItem from './ListItem.vue'
import { recentlyPlayedList } from '@renderer/store/playHistory/state'
import { loadRecentlyPlayed } from '@renderer/store/playHistory/action'
import { addTempPlayList } from '@renderer/store/player/action'
import { playNext } from '@renderer/core/player/action'
import { onMounted } from 'vue'

defineProps({
  columnNumber: {
    type: Number,
    default: 4,
  },
})

const listStyles = {
  display: 'grid',
  gap: '18px',
  gridTemplateColumns: 'repeat(1, 1fr)',
}

const handlePlay = (item: any) => {
  const musicInfo = {
    id: item.musicId,
    name: item.name,
    singer: item.singer,
    source: item.source,
    interval: item.meta?.interval ?? null,
    meta: item.meta,
  } as LX.Music.MusicInfo
  addTempPlayList([{ musicInfo, listId: null, isTop: true }])
  playNext()
}

onMounted(() => {
  void loadRecentlyPlayed(5)
})
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.recent {}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 24px;
  color: var(--color-font-label);
  font-size: 13px;
}
</style>
