<template>
  <div :class="$style.container" @click="handleContainerClick">
    <common-playlist-info
      :id="listId"
      author="14K"
      :cover="cover"
      :title="title"
      :count="count"
      :show-collect="false"
      @play="handlePlay"
      @delete="handleDelete"
    />
    <MusicList ref="musicList" :class="$style.musicList" :list-id="listId" />
  </div>
</template>

<script>
import { getListPrevSelectId } from '@renderer/utils/data'
import MusicList from './MusicList/index.vue'
import { removeUserListAction, playUserList } from './action'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Playlist',
  components: {
    MusicList,
  },
  async beforeRouteEnter(to, from, next) {
    let id = to.query.id
    if (!id) {
      id = await getListPrevSelectId()
      next({
        path: to.path,
        query: { id },
      })
    } else next()
  },
  beforeRouteUpdate(to, from) {
    // console.log(to, from)
    if (to.query.updated) return
    let id = to.query.id
    if (id == null) return
    // if (!getList(id)) {
    //   id = defaultList.id
    // }
    this.listId = id
    const scrollIndex = to.query.scrollIndex
    const isAnimation = from.query.id == to.query.id
    this.$refs.musicList?.handleRestoreScroll(scrollIndex, isAnimation)

    return {
      path: '/list',
      query: { id, updated: true },
    }
  },
  beforeRouteLeave(to, from) {
    this.$refs.musicList?.saveListPosition()
  },
  setup() {
    const listId = ref(null)
    const title = ref('')
    const description = ref('')
    const count = ref(0)
    const cover = ref('')
    const musicListRef = ref(null)
    const route = useRoute()
    const router = useRouter()

    const init = () => {
      const { id, title: routeTitle, count: routeCount, cover: routeCover } = route.query
      listId.value = id
      title.value = routeTitle
      count.value = routeCount
      cover.value = routeCover
    }
    init()

    const handlePlay = () => {
      playUserList(listId.value, count.value)
    }

    const handleDelete = () => {
      removeUserListAction(listId.value, title.value, () => {
        router.replace('/library')
      })
    }
    return {
      listId,
      title,
      description,
      count,
      cover,
      musicListRef,
      handlePlay,
      handleDelete,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.musicList{
  margin-top: 32px;
}
.container{
  padding-top: 24px
}
</style>
