<template>
  <div :class="$style.main">
    <div class="scroll" :class="$style.toc">
      <ul :class="$style.tocList" role="toolbar">
        <li v-for="h2 in tocList" :key="h2.id"
          :class="[$style.tocListItem, { [$style.active]: avtiveComponentName == h2.id }]" role="presentation">
          <h2 :class="[$style.tocH2]" role="tab" :aria-selected="avtiveComponentName == h2.id" :aria-label="h2.title"
            ignore-tip @click="toggleTab(h2.id)">
            <component :is="h2.icon" size="1.2em" weight="regular" :class="$style.icon" />
            <span>{{ h2.title }}</span>
          </h2>
        </li>
      </ul>
    </div>
    <div ref="dom_content_ref" class="scroll" :class="$style.setting">
      <dl>
        <component :is="avtiveComponentName" />
      </dl>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from '@common/utils/vueTools'
// import { currentStting } from './setting'
import { useI18n } from '@renderer/plugins/i18n'
import { useRoute } from '@common/utils/vueRouter'

import SettingBasic from './components/SettingBasic.vue'
import SettingPlay from './components/SettingPlay.vue'
import SettingPlayDetail from './components/SettingPlayDetail.vue'
import SettingDesktopLyric from './components/SettingDesktopLyric.vue'
import SettingSearch from './components/SettingSearch.vue'
import SettingList from './components/SettingList.vue'
import SettingDownload from './components/SettingDownload.vue'
import SettingSync from './components/SettingSync/index.vue'
import SettingOpenAPI from './components/SettingOpenAPI.vue'
import SettingLastFM from './components/SettingLastFM.vue'
import SettingHotKey from './components/SettingHotKey.vue'
import SettingNetwork from './components/SettingNetwork.vue'
import SettingOdc from './components/SettingOdc.vue'
import SettingBackup from './components/SettingBackup.vue'
import SettingOther from './components/SettingOther.vue'
import SettingUpdate from './components/SettingUpdate.vue'
import SettingAbout from './components/SettingAbout.vue'

import {
  PhGear,
  PhPlay,
  PhFaders,
  PhTextbox,
  PhMagnifyingGlass,
  PhListBullets,
  PhDownloadSimple,
  PhKeyboard,
  PhArrowsLeftRight,
  PhBracketsCurly,
  PhGlobe,
  PhCloud,
  PhFloppyDisk,
  PhDotsThreeCircle,
  PhArrowCircleUp,
  PhBroadcast,
  PhInfo,
} from '@phosphor-icons/vue'

export default {
  name: 'Setting',
  components: {
    SettingBasic,
    SettingPlay,
    SettingPlayDetail,
    SettingDesktopLyric,
    SettingSearch,
    SettingList,
    SettingDownload,
    SettingSync,
    SettingOpenAPI,
    SettingHotKey,
    SettingNetwork,
    SettingOdc,
    SettingBackup,
    SettingOther,
    SettingUpdate,
    SettingLastFM,
    SettingAbout,
  },
  setup() {
    const t = useI18n()
    const route = useRoute()

    const dom_content_ref = ref(null)

    const tocList = computed(() => {
      return [
        { id: 'SettingBasic', title: t('setting__basic'), icon: PhGear },
        { id: 'SettingPlay', title: t('setting__play'), icon: PhPlay },
        { id: 'SettingPlayDetail', title: t('setting__play_detail'), icon: PhFaders },
        { id: 'SettingDesktopLyric', title: t('setting__desktop_lyric'), icon: PhTextbox },
        { id: 'SettingSearch', title: t('setting__search'), icon: PhMagnifyingGlass },
        { id: 'SettingList', title: t('setting__list'), icon: PhListBullets },
        { id: 'SettingDownload', title: t('setting__download'), icon: PhDownloadSimple },
        { id: 'SettingHotKey', title: t('setting__hot_key'), icon: PhKeyboard },
        { id: 'SettingSync', title: t('setting__sync'), icon: PhArrowsLeftRight },
        { id: 'SettingOpenAPI', title: t('setting__open_api'), icon: PhBracketsCurly },
        { id: 'SettingNetwork', title: t('setting__network'), icon: PhGlobe },
        { id: 'SettingOdc', title: t('setting__odc'), icon: PhCloud },
        { id: 'SettingBackup', title: t('setting__backup'), icon: PhFloppyDisk },
        { id: 'SettingOther', title: t('setting__other'), icon: PhDotsThreeCircle },
        { id: 'SettingUpdate', title: t('setting__update'), icon: PhArrowCircleUp },
        { id: 'SettingLastFM', title: 'Last FM', icon: PhBroadcast },
        { id: 'SettingAbout', title: t('setting__about'), icon: PhInfo },
      ]
    })

    const avtiveComponentName = ref(route.query.name && tocList.value.some(t => t.id == route.query.name)
      ? route.query.name
      : tocList.value[0].id)

    const toggleTab = id => {
      avtiveComponentName.value = id
      void nextTick(() => {
        dom_content_ref.value?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      })
    }

    return {
      tocList,
      avtiveComponentName,
      dom_content_ref,
      toggleTab,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.main {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  padding: @gap 0;
  // border-top: var(--color-list-header-border-bottom);
}

.toc {
  position: fixed;
  width: 12%;
  background-color: var(--color-aside-background);

  ul {

    li {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0px;
        height: 100%;
        background-color: var(--color-primary);
        transition: all .3s ease;
      }
    }

    .active {
      background-color: var(--color-primary-background-hover);

      &::before {
        width: 3px;
      }
    }
  }
}

.tocH2 {
  line-height: 1.5;
  .mixin-ellipsis-1;
  font-size: 13px;
  color: var(--color-font);
  padding: 8px 10px;
  transition: @transition-fast;
  transition-property: background-color, color;

  &:not(.active) {
    cursor: pointer;

    &:hover {
      background-color: var(--color-button-background-hover);
    }
  }

  &.active {
    color: var(--color-primary);
  }

  .icon {
    margin-right: 6px;
    vertical-align: middle;
  }
}

.activeIcon {
  height: .9em;
  width: .9em;
  margin-left: -0.45em;
  vertical-align: -0.05em;
}

// .tocH3 {
//   font-size: 13px;
//   opacity: .8;
// }

// .tocList {
//   .tocList {
//     // padding-left: 15px;
//   }
// }
// .tocSubListItem {
//   padding-top: 10px;
// }

.setting {
  padding: 0 @gap ;
  padding-right: 0;
  font-size: 13px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
  position: relative;
  width: 100%;
  margin-left: 12%;

  :global {
    dt {
      margin: 15px 0;
      font-size: 24px;
      font-weight: 600;
      display: none;

      +dd h3 {
        margin-top: 0;
      }
    }

    dd {
      background-color: var(--color-aside-background);
      padding: @gap-md;
      margin-bottom: 12px;
    }

    dd:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 14px;
      font-weight: 600;
      padding-bottom: 6px;
    }

    .p {
      padding: 3px 0;
      line-height: 1.3;

      .btn {
        +.btn {
          margin-left: 10px;
        }
      }
    }

    .help-btn {
      padding: 0;
      margin: 0 0.4em;
      border: none;
      background: none;
      color: var(--color-button-font);
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }
    }

    .help-icon {
      margin: 0 0.4em;
    }
  }
}

// .btn-content {
//   display: inline-block;
//   transition: @transition-theme;
//   transition-property: opacity, transform;
//   opacity: 1;
//   transform: scale(1);

//   &.hide {
//     opacity: 0;
//     transform: scale(0);
//   }
// }


// :global(dt):target, :global(h3):target {
//   animation: highlight 1s ease;
// }

// @keyframes highlight {
//   from { background: yellow; }
//   to { background: transparent; }
// }</style>
