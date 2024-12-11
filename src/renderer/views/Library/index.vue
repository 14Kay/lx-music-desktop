<template>
    <div id="my-list" :class="$style.container" @click="handleContainerClick">
      <h1 :id="$style.title" class="title"><img :class="$style.avatar" :src="appSetting['common.avatar'] || 'https://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'" alt="avatar"> {{ appSetting['common.username'] || 'guest' }}的音乐库</h1>
      <Favorite :list-id="loveList.id" />
      <div :class="$style.lists">
        <div :class="$style.listsTitle">
          <span>我的歌单</span>
          <button
          :class="$style.tabButton"
          @click="visibleOpenNewListModal = true"
          ><base-svg-icon :class="$style.plus" icon-class="plus2" /> {{ $t('list__new_list_btn') }}
        </button>
        </div>
        <MyList />
      </div>

      <open-new-list-modal
        v-model="visibleOpenNewListModal"
        @update:model-submit="createList"
      />
    </div>
  </template>

<script>
import Favorite from './Favorite/index.vue'
import { loveList } from '@renderer/store/list/state'
import MyList from './List/index.vue'
import OpenNewListModal from './components/OpenNewListModal.vue'
import { ref } from 'vue'
import { createUserList } from '@renderer/store/list/action'
import { appSetting } from '@renderer/store/setting'

export default {
  name: 'Library',
  components: {
    Favorite,
    OpenNewListModal,
    MyList,
  },
  setup() {
    const visibleOpenNewListModal = ref(false)
    const createList = async(name) => {
      await createUserList({ name })
      visibleOpenNewListModal.value = false
    }
    return {
      visibleOpenNewListModal,
      createList,
      loveList,
      appSetting,
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
    .plus{
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
  .lists{
    padding-top: 24px;
    .listsTitle{
      font-size: 24px;
      font-weight: 600;
      padding: 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  #title{
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
  </style>
