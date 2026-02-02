<template>
  <div :class="$style.topContainer">
    <div :class="$style.top">
      <div :class="$style.left">
        <transition name="search-fade" mode="out-in">
          <Arrows v-if="!isShowSearch" :class="$style.arrows" />
          <SearchInput v-else :class="$style.search" :focus-on-mount="true" />
        </transition>
      </div>
      <div :class="$style.right">
        <div :class="$style.buttons">
          <div class="my__button" @click="isShowSearch = !isShowSearch">
            <PhMagnifyingGlass size="50%" />
          </div>
          <div class="my__button" @click="handleToggleDarkMode">
            <PhMoon v-if="!darkMode.enabled" size="50%" />
            <PhSun v-else size="50%" />
          </div>
        </div>
        <layout-toolbar :class="$style.toolbar" />
      </div>
    </div>
    <!-- <div :class="$style.nav">
      <Arrows :class="$style.arrows" />
      <NavBar :class="$style.navbar" />
      <SearchInput :class="$style.search" />
    </div> -->
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
import { PhMagnifyingGlass, PhMoon, PhSun } from '@phosphor-icons/vue'
import { ref } from '@common/utils/vueTools'
import { darkMode, toggleDarkMode } from '@renderer/store/theme/state'

const isShowSearch = ref(false)

export type SearchSource = LX.OnlineSource | 'all'

const search = (text: string, source: SearchSource, page: number) => {
  void searchMusic(text, page, source).then((list: LX.Music.MusicInfo[]) => {
    if (list.length) {
      setTimeout(async () => {
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
  onPlayTargetMusic(async ({ params: data }) => {
    const { name, source } = data
    search(name, source as SearchSource, 1)
  })
})

const handleToggleDarkMode = () => {
  console.log('Dark mode toggled from Top/index.vue')
  toggleDarkMode()
}
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

.arrows {
  display: flex;
  align-items: center;
  z-index: 99;
  position: relative;
}

.navbar {
  flex: 4;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.topContainer {
  padding-left: @gap;
}

.top {
  display: flex;
  // Ensure the top container itself is draggable
  -webkit-app-region: drag;

  .left {
    flex: 4;
    display: flex;
    align-items: flex-start;
    gap: 15px;

    .arrows,
    .search {
      -webkit-app-region: no-drag;
    }
  }

  .right {
    flex: 1;
    margin-left: @gap;
    display: flex;
    align-items: center;
    gap: 15px;

    .buttons {
      display: flex;
      gap: 15px;
      z-index: 999;
      -webkit-app-region: no-drag;
    }

    .toolbar {
      -webkit-app-region: no-drag;
    }
  }

}

:global(.search-fade-enter-active),
:global(.search-fade-leave-active) {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

:global(.search-fade-enter-from),
:global(.search-fade-leave-to) {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
