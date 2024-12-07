<template>
  <play-progress
  :handle-transition-end="handleTransitionEnd"
  />
  <div :class="$style.player">
    <div :class="$style.song">
      <div
        :class="$style.picContent"
        :aria-label="$t('player__pic_tip')"
        @contextmenu="handleToMusicLocation"
        @click="showPlayerDetail"
      >
        <img
          v-if="musicInfo.pic"
          :src="musicInfo.pic"
          decoding="async"
          @error="imgError"
        />
        <div v-else :class="$style.emptyPic">L<span>X</span></div>
      </div>
      <div :class="$style.infoContent">
        <div
          :class="$style.title"
          :aria-label="title + $t('copy_tip')"
          @click="handleCopy(title)"
        >
          {{ title }}
        </div>
        <div :class="$style.status"><play-time /></div>
      </div>
    </div>

    <div :class="$style.playBtnContent">
      <base-button-icon
        :class="$style.playBtn"
        :aria-label="$t('player__prev')"
        @click="playPrev()"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 1024 1024"
          space="preserve"
        >
          <use xlink:href="#icon-previous" />
        </svg>
      </base-button-icon>

      <base-button-icon
        :id="$style.playBtn"
        :class="$style.playBtn"
        :aria-label="isPlay ? $t('player__pause') : $t('player__play')"
        @click="togglePlay"
      >
        <svg
          v-if="isPlay"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 1024 1024"
          space="preserve"
        >
          <use xlink:href="#icon-pause" />
        </svg>
        <svg
          v-else
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 1024 1024"
          space="preserve"
        >
          <use xlink:href="#icon-play" />
        </svg>
      </base-button-icon>

      <base-button-icon
        :class="$style.playBtn"
        :aria-label="$t('player__next')"
        @click="playNext()"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 1024 1024"
          space="preserve"
        >
          <use xlink:href="#icon-next" />
        </svg>
      </base-button-icon>
    </div>

    <div :class="$style.control">
      <control-btns />
    </div>
  </div>
</template>

<script>
import { computed } from '@common/utils/vueTools'
import { useRouter } from '@common/utils/vueRouter'
import { clipboardWriteText } from '@common/utils/electron'
import ControlBtns from './ControlBtns.vue'
import PlayTime from './PlayTime.vue'
import PlayProgress from './PlayProgress.vue'
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'
// import { lyric } from '@renderer/core/share/lyric'
import {
  musicInfo,
  isShowPlayerDetail,
  isPlay,
  playInfo,
  playMusicInfo,
} from '@renderer/store/player/state'
import {
  setMusicInfo,
  setShowPlayerDetail,
} from '@renderer/store/player/action'
import { appSetting } from '@renderer/store/setting'
import { togglePlay, playNext, playPrev } from '@renderer/core/player'
import { LIST_IDS } from '@common/constants'

export default {
  name: 'CorePlayBar',
  components: {
    ControlBtns,
    PlayTime,
    PlayProgress,
  },
  setup() {
    const router = useRouter()

    const {
      nowPlayTimeStr,
      maxPlayTimeStr,
      progress,
      isActiveTransition,
      handleTransitionEnd,
    } = usePlayProgress()

    const showPlayerDetail = () => {
      if (!playMusicInfo.musicInfo) return
      setShowPlayerDetail(true)
    }
    const handleCopy = (text) => {
      clipboardWriteText(text)
    }

    const imgError = () => {
      // console.log(e)
      setMusicInfo({ pic: null })
    }

    const handleToMusicLocation = () => {
      const listId = playMusicInfo.listId
      if (!listId || listId == LIST_IDS.DOWNLOAD || !playMusicInfo.musicInfo) { return }
      if (playInfo.playIndex == -1) return
      void router.push({
        path: '/library',
        query: {
          id: listId,
          scrollIndex: playInfo.playIndex,
        },
      })
    }

    const title = computed(() => {
      return musicInfo.name
        ? appSetting['download.fileName']
          .replace('歌名', musicInfo.name)
          .replace('歌手', musicInfo.singer)
        : ''
    })

    // onBeforeUnmount(() => {
    // window.eventHub.emit(eventPlayerNames.setTogglePlay)
    // })

    return {
      musicInfo,
      nowPlayTimeStr,
      maxPlayTimeStr,
      progress,
      isActiveTransition,
      handleTransitionEnd,
      handleCopy,
      imgError,
      title,
      showPlayerDetail,
      isPlay,
      togglePlay,
      playNext,
      playPrev,
      handleToMusicLocation,
      isShowPlayerDetail,
    }
  },
}
</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";

.player {
  position: relative;
  height: @height-player;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  contain: strict;
  padding-bottom: 8px;
  padding-top: 10px;
  z-index: 2;
  padding-right: 10vw;
  padding-left: 10vw;
  * {
    box-sizing: border-box;
  }
}
.control{
  display: flex;
  justify-content: end;
  align-items: center;
}
.song {
  height: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
  .picContent {
    height: 100%;
    aspect-ratio: 1 / 1;

    // color: var(--color-primary);
    // transition: @transition-normal;
    // transition-property: color;
    flex: none;
    opacity: 1;
    transition: opacity @transition-fast;
    // transition-property: opacity;
    display: flex;
    justify-content: center;
    // align-items: center;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    // svg {
    //   fill: currentColor;
    // }
    img {
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
      max-width: 100%;
      max-height: 100%;
      transition: @transition-normal;
      transition-property: border-color;
      // border-radius: 50%;
      border-radius: @radius-border;
      // border: 2px solid @color-theme_2-background_1;
    }

    .emptyPic {
      background-color: var(--color-primary-light-900-alpha-200);
      border-radius: @radius-border;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary-light-400-alpha-200);
      user-select: none;
      font-size: 20px;
      font-family: Consolas, "Courier New", monospace;

      span {
        padding-left: 3px;
      }
    }
  }

  .infoContent {
    padding: 0 10px;
    flex: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    font-size: 13px;
    color: var(--color-font);
    min-width: 0;
    line-height: 1.5;
  }
}

.title {
  max-width: 100%;
  font-size: 12px;
  color: var(--color-font-label);
  .mixin-ellipsis-1;
}
.status {
  padding-top: 3px;
  height: 23px;
  .mixin-ellipsis-1;
  max-width: 100%;
}

.playBtnContent {
  height: 100%;
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.playBtn {
  flex: none;
  // margin-top: -2px;
  transition: @transition-fast;
  transition-property: color, opacity;
  color: var(--color-1000);
  opacity: 1;
  cursor: pointer;
  svg {
    height: 18px;
    fill: currentColor;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
}

#playBtn {
  svg {
    height: 24px;
  }
}
</style>
