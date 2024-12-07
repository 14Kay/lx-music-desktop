<!--
 * @Description: 我的最爱
 * @Author: 14K
 * @Date: 2024-12-03 15:39:40
 * @LastEditTime: 2024-12-06 14:57:06
 * @LastEditors: 14K
-->
<template>
  <div :class="$style.lists" :style="rowStyles">
    <div>
      <material-playlist
        :list-id="loveList.id"
        :cover="_loveLists.cover || ''"
        :title="$t(loveList.name)"
        :is-my-playlist="true"
        :count="_loveLists.count"
        ></material-playlist>
    </div>
    <div>
      <material-playlist
        :list-id="defaultList.id"
        :cover="_defaultLists.cover || ''"
        :title="$t(defaultList.name)"
        :is-my-playlist="true"
        :count="_defaultLists.count"
        ></material-playlist>
    </div>
    <div v-for="item in _userLists" :key="item.id">
      <material-playlist
        :list-id="item.id"
        :cover="item.cover || ''"
        :title="item.name"
        :is-my-playlist="true"
        :count="item.count"
        ></material-playlist>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loveList, defaultList, userLists } from '@renderer/store/list/state'
import { getListMusics } from '@renderer/store/list/action'
import { ref, computed, onBeforeUnmount, watch } from 'vue'
let stopWatchUserList: any = null

interface List {
  cover: string | null | undefined
  id: string
  count: number
}

const props = defineProps({
  columnNumber: {
    type: Number,
    default: 5,
  },
  gap: {
    type: String,
    default: '24px 24px',
  },
})

const _loveLists = ref<List>({ cover: null, id: '', count: 0 })
const _defaultLists = ref<List>({ cover: null, id: '', count: 0 })
const _userLists = ref<Array<List & { name: string }>>([])

const rowStyles = computed(() => ({
  'grid-template-columns': `repeat(${props.columnNumber}, 1fr)`,
  gap: props.gap,
}))

getListMusics(loveList.id).then(res => {
  if (res && res.length > 0) {
    _loveLists.value = {
      cover: res.find(item => item.meta.picUrl)?.meta.picUrl,
      id: loveList.id,
      count: res.length,
    }
  }
})

getListMusics(defaultList.id).then(res => {
  if (res && res.length > 0) {
    _defaultLists.value = {
      cover: res.find(item => item.meta.picUrl)?.meta.picUrl,
      id: defaultList.id,
      count: res.length,
    }
  }
})

async function fetchAndAddList(id: string, name: string, cover: string | null | undefined) {
  const res = await getListMusics(id)
  if (res) {
    _userLists.value.push({
      cover: cover ?? res.find(item => item.meta.picUrl)?.meta.picUrl,
      name,
      id,
      count: res.length,
    })
  }
}

const getList = () => {
  _userLists.value = []
  userLists.forEach(list => {
    fetchAndAddList(list.id, list.name, list.cover)
  })
}
getList()
stopWatchUserList = watch(userLists, getList)

onBeforeUnmount(() => {
  if (stopWatchUserList) {
    stopWatchUserList()
    stopWatchUserList = null
  }
})

</script>
<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.lists{
  display: grid;
  > div{
    .text {
      margin-top: 8px;
      .title {
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-all;
      }
      .info {
        font-size: 12px;
        opacity: 0.68;
        line-height: 18px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-word;
      }
    }
  }
}
</style>
