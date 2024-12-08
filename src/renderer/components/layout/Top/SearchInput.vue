<template>
  <div :class="$style.headerSerach">
    <material-search-input v-model="searchText" :list="tipList" :visible-list="visibleList" @event="handleEvent" />
    <div :class="$style.avatarContainer">
      <img :src="appSetting['common.avatar']" @click="showMenu = !showMenu" @click.stop>
      <div :class="[$style.menuContainer, { [$style.show]: showMenu }]">
          <div @click="goDownload">{{ $t('download') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import music from '@renderer/utils/musicSdk'
import { debounce } from '@common/utils'
import { inject, onMounted, onBeforeUnmount } from 'vue'
import {
  ref,
  watch,
  nextTick,
} from '@common/utils/vueTools'
import { useRouter, useRoute } from '@common/utils/vueRouter'
import { appSetting } from '@renderer/store/setting'
import { searchText as _searchText } from '@renderer/store/search/state'
import { setSearchText } from '@renderer/store/search/action'
import { getSearchSetting } from '@renderer/utils/data'


const searchText = ref('')
const visibleList = ref(false)
const tipList = ref([])
const showMenu = ref(false)
let isFocused = false
let prevTempSearchSource = ''
const $bus = inject('$bus')
const route = useRoute()
const router = useRouter()

watch(() => route.name, (newValue, oldValue) => {
  if (oldValue == 'Search' && newValue != 'SongListDetail') {
    setTimeout(() => {
      if (appSetting['odc.isAutoClearSearchInput'] && searchText.value) searchText.value = ''
      if (appSetting['odc.isAutoClearSearchList']) setSearchText('')
    })
  }
})

watch(_searchText, (newValue, oldValue) => {
  searchText.value = newValue
  if (newValue !== searchText.value) searchText.value = newValue
})
watch(searchText, () => {
  handleTipSearch()
})

const handleOnPageClick = () => {
  if (showMenu.value) {
    showMenu.value = false
  }
}


const tipSearch = debounce(async() => {
  if (searchText.value === '' && prevTempSearchSource) {
    tipList.value = []
    music[prevTempSearchSource].tipSearch.cancelTipSearch()
    return
  }
  const { temp_source } = await getSearchSetting()
  prevTempSearchSource ||= temp_source
  music[prevTempSearchSource].tipSearch.search(searchText.value).then(list => {
    tipList.value = list
  }).catch(() => {})
}, 50)

const handleTipSearch = () => {
  if (!visibleList.value && isFocused) visibleList.value = true
  tipSearch()
}

const handleSearch = () => {
  visibleList.value &&= false
  if (!searchText.value && route.path != '/search') {
    setSearchText('')
    return
  }
  setTimeout(() => {
    router.push({
      path: '/search',
      query: {
        text: searchText.value,
      },
    }).catch(_ => _)
  }, searchText.value ? 200 : 0)
}

const handleEvent = ({ action, data }) => {
  switch (action) {
    case 'focus':
      isFocused = true
      visibleList.value ||= true
      if (searchText.value) handleTipSearch()
      break
    case 'blur':
      isFocused = false
      setTimeout(() => {
        visibleList.value &&= false
      }, 50)
      break
    case 'submit':
      handleSearch()
      break
    case 'listClick':
      searchText.value = tipList.value[data]
      void nextTick(handleSearch)
  }
}

const goDownload = () => {
  showMenu.value = false
  router.push('/download')
}

onMounted(() => {
  $bus.on('click', handleOnPageClick)
})

onBeforeUnmount(() => {
  $bus.off('click', handleOnPageClick)
})

</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";
  .headerSerach{
    display: flex;
    align-items: center;
    position: relative;
    z-index: 99;
  }
  .avatar-container{
    margin-left: 16px;
    position: relative;
    -webkit-app-region: no-drag;
    img{
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .menu-container {
      position: absolute;
      left: 10%;
      top: 80%;
      border-radius: @radius-border * 1.5;
      background-color: var(--color-content-background);
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, .2);
      z-index: 10;
      overflow: hidden;
      padding: 8px;
      width: 80px;
      font-size: 14px;
      opacity: 0;
      transform: scale(0);
      transform-origin: 0 0 0;
      transition: .14s ease;
      transition-property: transform, opacity;
      z-index: 9;
      div {
          cursor: pointer;
          line-height: 34px;
          border-radius: 5px;
          // color: var(--color-button-font);
          padding: 0 10px;
          text-align: center;
          outline: none;
          transition: @transition-normal;
          transition-property: background-color, opacity;
          box-sizing: border-box;
          .mixin-ellipsis-1;
          // background-color: var(--color-primary-light-600-alpha-800);

          &:hover {
              background-color: var(--color-primary-background-hover);
          }

          &:active {
              background-color: var(--color-primary-background-active);
          }

          &[disabled] {
              cursor: default;
              opacity: .4;

              &:hover {
                  background: none !important;
              }
          }
      }
    }
    .menu-container.show {
        opacity: 1;
        transform: scale(1);
    }
  }
</style>
