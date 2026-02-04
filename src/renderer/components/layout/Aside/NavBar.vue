<template>
  <div ref="dom_menu" :class="$style.menu">
    <ul :class="$style.list" role="toolbar">
      <li v-for="item in menus" :key="item.to" :class="$style.navItem" role="presentation">
        <router-link :class="[$style.link, { [$style.active]: $route.meta.name == item.name }]" role="tab"
          :aria-selected="$route.meta.name == item.name" :to="item.to" :aria-label="item.tips">
          <component :is="item.icon" :size="item.size" weight="regular" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { appSetting } from '@renderer/store/setting'
import { useI18n } from '@root/lang'
import { ref, computed } from '@common/utils/vueTools'
import { useIconSize } from '@renderer/utils/compositions/useIconSize'
import { PhHouseSimple, PhRanking, PhGear, PhDownload, PhSquaresFour } from '@phosphor-icons/vue'

export default {
  name: 'NavBar',
  setup() {
    const t = useI18n()
    const dom_menu = ref<HTMLElement>()
    const iconSize = useIconSize(dom_menu, 0.35)

    const menus = computed(() => {
      const size = iconSize.value
      return [
        {
          to: '/library',
          tips: t('my_list'),
          icon: PhHouseSimple,
          size,
          name: 'Library',
          enable: true,
        },
        {
          to: '/songList/list',
          tips: t('song_list'),
          icon: PhSquaresFour,
          size,
          name: 'SongList',
          enable: true,
        },
        {
          to: '/leaderboard',
          tips: t('leaderboard'),
          icon: PhRanking,
          size,
          name: 'Leaderboard',
          enable: true,
        },

        {
          to: '/download',
          tips: t('download'),
          icon: PhDownload,
          size,
          enable: appSetting['download.enable'],
          name: 'Download',
        },
        {
          to: '/setting',
          tips: t('setting'),
          icon: PhGear,
          size,
          enable: true,
          name: 'Setting',
        },
      ].filter(m => m.enable)
    })
    return {
      appSetting,
      menus,
      dom_menu,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.menu {
  flex: auto;

  // &.controlBtnLeft {
  //   display: flex;
  //   flex-flow: column nowrap;
  //   justify-content: center;
  //   padding-bottom: @control-btn-height;
  // }
  // padding: 5px;
}

.list {
  -webkit-app-region: no-drag;

  // margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }

  // background-color: pink;
  // dt {
  //   padding-left: 5px;
  //   font-size: 11px;
  //   transition: @transition-normal;
  //   transition-property: color;
  //   color: @color-theme-font-label;
  //   .mixin-ellipsis-1();
  // }
}

.navItem {
  position: relative;
  height: 60px;

  &:before {
    content: '';
    display: block;
    width: 100%;
    padding-bottom: 84%;
  }
}

.link {
  position: absolute;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  // left: 15%;
  // top: 15%;
  // width: 70%;
  // height: 70%;
  // display: block;
  box-sizing: border-box;
  // text-decoration: none;
  // border-radius: 20%;

  // padding: 18px 3px;
  // margin: 5px 0;
  // border-left: 5px solid transparent;
  transition: @transition-fast;
  transition-property: background-color, opacity;
  cursor: pointer;
  // font-size: 11.5px;
  text-align: center;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  // border-radius: @radius-border;
  .mixin-ellipsis-1();

  &:before {
    .mixin-after();
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: var(--color-primary-dark-200-alpha-700);
    border-radius: 4px;
    transform: translateX(-100%);
    transition: transform @transition-fast;
  }

  &.active {
    // border-left-color: @color-theme-active;
    background-color: var(--color-primary-light-300-alpha-700);
    color: var(--color-nav-font);

    &:before {
      transform: translateX(0);
    }

    &:hover {
      background-color: var(--color-primary-light-300-alpha-800);
    }
  }


  &:hover {
    color: var(--color-nav-font);

    &:not(.active) {
      opacity: .8;
      background-color: var(--color-primary-light-400-alpha-700);
    }
  }

  &:active:not(.active) {
    opacity: .6;
    background-color: var(--color-primary-light-300-alpha-600);
  }
}

// .icon {
//   // margin-bottom: 5px;
//   &> svg {
//     width: 32%;
//   }
// }</style>
