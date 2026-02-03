<template>
  <div id="my-list" :class="$style.container" @click="handleContainerClick">
    <Favorite :list-id="loveList.id" />

    <div :class="$style.lists">
      <div :class="$style.left">
        <MyList />
      </div>
      <div :class="$style.right">
        <div :class="$style.mostPlayed">
          <h2 class="my__title"><span>MOST PLAYED</span></h2>
          <ListItem v-for="(item) in mostPlayedList" :key="item.musicId"
            :cover="item.meta?.picUrl || item.meta?.albumImg || ''" :name="item.name" :singer="item.singer"
            :play-count="item.playCount" @dblclick="handlePlay(item)" />
          <div v-if="mostPlayedList.length === 0" :class="$style.empty">暂无播放记录</div>
        </div>
      </div>
    </div>

    <open-new-list-modal v-model="visibleOpenNewListModal" @update:model-submit="createList" />
  </div>
</template>

<script>
import Favorite from './Favorite/index.vue'
import { loveList } from '@renderer/store/list/state'
import MyList from './List/index.vue'
import OpenNewListModal from './components/OpenNewListModal.vue'
import { ref, onMounted } from 'vue'
import { createUserList } from '@renderer/store/list/action'
import { appSetting } from '@renderer/store/setting'
import ListItem from './Favorite/ListItem.vue'
import { mostPlayedList } from '@renderer/store/playHistory/state'
import { loadMostPlayed } from '@renderer/store/playHistory/action'
import { addTempPlayList } from '@renderer/store/player/action'
import { playNext } from '@renderer/core/player/action'

export default {
  name: 'Library',
  components: {
    Favorite,
    OpenNewListModal,
    MyList,
    ListItem,
  },
  setup() {
    const visibleOpenNewListModal = ref(false)
    const createList = async (name) => {
      await createUserList({ name })
      visibleOpenNewListModal.value = false
    }

    const handlePlay = (item) => {
      const musicInfo = {
        id: item.musicId,
        name: item.name,
        singer: item.singer,
        source: item.source,
        interval: item.meta?.interval ?? null,
        meta: item.meta,
      }
      addTempPlayList([{ musicInfo, listId: null, isTop: true }])
      playNext()
    }

    onMounted(() => {
      void loadMostPlayed(4)
    })

    return {
      visibleOpenNewListModal,
      createList,
      loveList,
      appSetting,
      mostPlayedList,
      handlePlay,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.tab-button {
  color: var(--color-text);
  border-radius: 8px;
  padding: 0 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  opacity: 0.68;
  font-weight: 500;
  outline: none;
  border: none;
  cursor: pointer;
  background: none;
  height: 40px;

  .plus {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }

  &:hover {
    opacity: 1;
    background: var(--color-primary-alpha-900);
  }

  &:active {
    opacity: 1;
    transform: scale(0.92);
  }
}

.container {
  height: 100%;
  position: relative;
}

.lists {
  padding-top: 24px;

  display: flex;

  .left {
    display: flex;
    flex: 4
  }

  .right {
    flex: 1;
    margin-left: @gap;

    .mostPlayed {
      display: grid;
      gap: 18px;
    }
  }


}

.listsTitle {
  font-size: 24px;
  font-weight: 600;
  padding: 24px 0;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc((100% - 24px) * 0.8);
  }
}

#title {
  display: flex;
  align-items: center;

  .avatar {
    height: 44px;
    margin-right: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.2);
  }
}

.empty {
  color: var(--color-text);
  opacity: 0.5;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
