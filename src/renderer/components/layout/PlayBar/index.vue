<template>
  <div :class="[$style.player, 'my__container']">
    <div :class="[$style.left, 'my__left']">
      <div :class="$style.song">
        <div :class="$style.picContent" :aria-label="$t('player__pic_tip')" @contextmenu="handleToMusicLocation"
          @click="showPlayerDetail">
          <img v-if="musicInfo.pic" :src="musicInfo.pic" decoding="async" @error="imgError" />
          <div v-else :class="$style.emptyPic">L<span>X</span></div>
        </div>
        <div :class="$style.infoContent">
          <div :class="$style.name" :aria-label="title + $t('copy_tip')" @click="handleCopy(title)">
            {{ musicInfo.name }}
          </div>
          <div :class="$style.singer">
            {{ musicInfo.singer }}
          </div>
        </div>
      </div>

      <div :class="$style.controlBtn1">
        <common-toggle-play-mode-btn />
        <div class="my__button" :aria-label="toggleDesktopLyricBtnTitle" @click="toggleDesktopLyric"
          @contextmenu="toggleLockDesktopLyric">
          <svg v-show="appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink" height="66%" viewBox="0 0 512 512" space="preserve">
            <use xlink:href="#icon-desktop-lyric-on" />
          </svg>
          <svg v-show="!appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink" height="66%" viewBox="0 0 512 512" space="preserve">
            <use xlink:href="#icon-desktop-lyric-off" />
          </svg>
        </div>
      </div>

      <div :class="$style.playBtnContent">
        <div :class="$style.arrow" :aria-label="$t('player__prev')" @click="playPrev()">
          <PhRewind size="55%" weight="fill" />
        </div>

        <div class="my__button_fill my__button" :aria-label="isPlay ? $t('player__pause') : $t('player__play')"
          @click="togglePlay">
          <PhPause v-if="isPlay" size="35%" weight="fill" />
          <PhPlay v-else size="35%" weight="fill" />
        </div>

        <div :class="$style.arrow" :aria-label="$t('player__next')" @click="playNext()">
          <PhFastForward size="55%" weight="fill" />
        </div>
      </div>

      <div :class="$style.progressContainer">
        <play-progress :handle-transition-end="handleTransitionEnd" />
      </div>
    </div>

    <div :class="[$style.right, 'my__right']">
      <div :class="$style.control">
        <control-btns />
      </div>

      <div>
        <common-volume-progress />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@common/utils/vueTools'
import { useRouter } from '@common/utils/vueRouter'
import { clipboardWriteText } from '@common/utils/electron'
import ControlBtns from './ControlBtns.vue'
import PlayProgress from './PlayProgress.vue'
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'
// import { lyric } from '@renderer/core/share/lyric'
import { PhPause, PhPlay, PhRewind, PhFastForward } from '@phosphor-icons/vue'
import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
import { appSetting } from '@renderer/store/setting'

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
import { togglePlay, playNext, playPrev } from '@renderer/core/player'
import { LIST_IDS } from '@common/constants'

export default {
  name: 'CorePlayBar',
  components: {
    ControlBtns,
    PlayProgress,
    PhPause,
    PhPlay,
    PhRewind,
    PhFastForward,
  },
  setup() {
    const router = useRouter()
    const {
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    } = useToggleDesktopLyric()

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
      appSetting,
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
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    }
  },
}
</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";

.controlBtn1 {
  display: flex;
  gap: 20px;
}

.progressContainer {
  position: relative;
  width: 32vw;
}

.player {
  position: relative;
  height: @height-player;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: @gap;
  padding-bottom: 8px;
  padding-top: 10px;
  z-index: 2;
  padding-right: @gap;
  padding-left: @gap;

  * {
    box-sizing: border-box;
  }


  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
}

.control {
  display: flex;
  justify-content: end;
  align-items: center;
  position: relative;
  left: 10px;
}

.song {
  height: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
  width: 200px;
  height: 36px;

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
    padding: 1px 10px;
    flex: auto;
    display: flex;
    flex-flow: column nowrap;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    color: var(--color-font);
    min-width: 0;
    height: 100%;
    align-items: flex-start;
  }
}

.title {
  max-width: 100%;
  font-size: 12px;
  color: var(--color-font-label);
  .mixin-ellipsis-1();
}

.name {
  font-weight: 600;
}

.name,
.singer {
  .mixin-ellipsis-1();
  width: 100%;
}

.singer {
  font-size: 10px;
  color: var(--color-font-label);
}

.status {
  padding-top: 3px;
  height: 23px;
  .mixin-ellipsis-1();
  max-width: 100%;
}

.playBtnContent {
  height: 100%;
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
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


.arrow {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-primary);
}
</style>
