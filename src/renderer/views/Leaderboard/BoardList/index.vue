<template>
  <div :class="$style.listsContentContainer" :style="{height: isOpen ? height + 'px': maxHeight + 'px'}">
    <div>
      <ul ref="domContainer" :class="[$style.listsContent]">
        <li
          v-for="(item, index) in list"
          :key="item.id" :class="[$style.listsItem, { [$style.active]: item.id == boardId }, { [$style.clicked]: rightClickItemIndex == index }]"
          :aria-label="item.name" @click="handleToggleList(item.id)" @contextmenu="handleRigthClick($event, index)"
        >
          <base-button :class="$style.listsLabel">
            {{ item.name }}
          </base-button>
        </li>
      </ul>
    </div>
    <base-button v-show="(height > maxHeight) || isOpen" :class="$style.more" @click="isOpen = !isOpen">
      <base-svg-icon icon-class="more" />
    </base-button>
  </div>
  <base-menu
    v-model="isShowMenu"
    :menus="menus"
    :xy="menuLocation"
    item-name="name"
    @menu-click="handleMenuClick"
  />
</template>

<script setup>
import { watch, shallowReactive } from '@common/utils/vueTools'
import { getBoardsList, setBoard } from '@renderer/store/leaderboard/action'
import { boards } from '@renderer/store/leaderboard/state'
import useMenu from './useMenu'
import { useRouter, useRoute } from '@common/utils/vueRouter'
import { useMore } from './useMore'
import { ref } from 'vue'

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
  boardId: {
    type: [String, undefined],
    default: undefined,
  },
})
const maxHeight = 38
const isOpen = ref(false)
const domContainer = ref()
const emit = defineEmits(['show-menu'])

const router = useRouter()
const route = useRoute()

const list = shallowReactive([])
const rightClickItemIndex = ref(-1)

const handleToggleList = (id) => {
  void router.replace({
    path: route.path,
    query: {
      source: props.source,
      boardId: id,
    },
  })
}

const {
  menus,
  menuLocation,
  isShowMenu,
  showMenu,
  menuClick,
} = useMenu({ emit, list })

const { height } = useMore(domContainer)

const handleRigthClick = (event, index) => {
  rightClickItemIndex.value = index
  showMenu(event, index)
}
const handleMenuClick = (action) => {
  if (rightClickItemIndex.value < 0) return
  let index = rightClickItemIndex.value
  rightClickItemIndex.value = -1
  menuClick(action, index, props.source)
}

watch(() => props.source, async(source) => {
  // const source = (await getLeaderboardSetting()).source as LX.OnlineSource
  let boardList = boards[source]
  if (boardList == null) setBoard(boardList = await getBoardsList(source), source)
  list.splice(0, list.length, ...boardList.list)
  if (!props.boardId && boardList.list.length) handleToggleList(boardList.list[0].id)
}, {
  immediate: true,
})

defineExpose({ hideMenu: handleMenuClick })
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.open{
  flex-wrap: wrap !important;
}

.more{
  position: absolute;
  right: 0;
  z-index: 9;
  top: 0;
  &:before{
    content: '';
    display: block;
    width: 120%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 8;
    left: -121%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--color-primary-light-1000));
    pointer-events: none;
  }
}
.listsContentContainer{
  width: 100%;
  position: relative;
  height: 38px;
  overflow: hidden;
  transition: all .3s ease;
  >div{
    display: inline-block;
  }
}

.listsContent {
  display: flex;
  flex-flow: row nowrap;
  font-size: 15px;
  font-weight: 700;
  gap: 16px;
  flex-wrap: wrap;
}
.listsItem {
  transition: .3s ease;
  transition-property: color, background-color;
  background-color: transparent;
  &:hover:not(.active) {
    background-color: var(--color-primary-background-hover);
    cursor: pointer;
  }
  &.active {
    // background-color:
    color: var(--color-primary);
  }
  &.selected {
    background-color: var(--color-primary-font-active);
  }
  &.clicked {
    background-color: var(--color-primary-background-hover);
  }
  &.editing {
    padding: 0 10px;
    background-color: var(--color-primary-background-hover);
    .listsLabel {
      display: none;
    }
    .listsInput {
      display: block;
    }
  }
}
.activeIcon {
  height: .9em;
  width: .9em;
  margin-left: -0.45em;
  vertical-align: -0.05em;
}
.listsLabel {
  display: block;
  height: 100%;
  padding: 0 10px;
  font-size: 13px;
  .mixin-ellipsis-1;
}
</style>

