<template>
  <div :class="$style.container">
    <common-playlist-info
:author="appSetting['common.username']" :cover="cover" :list-id="listId" :title="title"
      :count="count" :show-collect="false" @play="handlePlay" @delete="handleDelete"
      @search="handleSearch"
/>
    <MusicList :class="$style.musicList" :list-id="listId" :search="searchContent" />
  </div>
</template>

<script setup lang="ts">
import MusicList from './MusicList/index.vue'
import { removeUserListAction, playUserList } from './action'
import { ref } from 'vue'
import { useRoute, useRouter } from '@common/utils/vueRouter'
import { appSetting } from '@renderer/store/setting'
const route = useRoute()
const router = useRouter()

const searchContent = ref('')
const listId = ref('')
const title = ref('')
const count = ref('0')
const cover = ref('')
listId.value = route.query.id as string
title.value = route.query.title as string
count.value = route.query.count as string
cover.value = route.query.cover as string

const handlePlay = () => {
  playUserList(listId.value, Number(count.value))
}

const handleDelete = () => {
  removeUserListAction(listId.value, title.value, () => {
    router.replace('/library')
  })
}

const handleSearch = (content: string) => {
  if (content.trim() === searchContent.value.trim()) return
  searchContent.value = content.toLowerCase().trim()
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.musicList {
  margin-top: 32px;
}

.container {
  padding-top: 24px
}
</style>
