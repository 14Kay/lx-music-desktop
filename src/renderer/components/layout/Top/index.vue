<template>
  <div>
    <layout-toolbar :class="$style.toolbar" />
    <div :class="$style.nav">
      <Arrows :class="$style.arrows" />
      <NavBar :class="$style.navbar" />
      <SearchInput :class="$style.search" />
    </div>
  </div>
</template>
<script setup lang="ts">
import NavBar from './NavBar.vue'
import SearchInput from './SearchInput.vue'
import Arrows from './Arrows.vue'
import { search as searchMusic } from '@renderer/store/search/music'
import { onPlayTargetMusic } from '@renderer/utils/ipc'
import { onMounted } from '@common/utils/vueTools'
import { assertApiSupport } from '@renderer/store/utils'
import { LIST_IDS } from '@common/constants'
import { getListMusics, addListMusics } from '@renderer/store/list/action'
import { playList } from '@renderer/core/player/action'

export type SearchSource = LX.OnlineSource | 'all'

const search = (text: string, source: SearchSource, page: number) => {
  void searchMusic(text, page, source).then((list: LX.Music.MusicInfo[]) => {
    if (list.length) {
      setTimeout(async() => {
        let targetSong = list[0]

        if (!assertApiSupport(targetSong.source)) return
        const defaultListMusics = await getListMusics(LIST_IDS.DEFAULT)

        await addListMusics(LIST_IDS.DEFAULT, [targetSong])

        setTimeout(() => {
          let targetIndex = defaultListMusics.findIndex(s => s.id === targetSong.id)
          if (targetIndex > -1) playList(LIST_IDS.DEFAULT, targetIndex)
        }, 100)
      })
    }
  })
}

onMounted(() => {
  onPlayTargetMusic(async({ params: data }) => {
    const { name, source } = data
    search(name, source as SearchSource, 1)
  })
})
</script>
<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  margin-top: 20px;
  z-index: 888;
}

.toolbar{
  height: 30px
}

.arrows{
  flex: 1;
  display: flex;
  align-items: center;
  z-index: 99;
}

.navbar{
  flex: 3;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
}

.search{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
