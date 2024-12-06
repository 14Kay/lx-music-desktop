<template>
  <div>
    <div :style="listStyles">
      <ListItem
v-for="(item, index) in list" :key="item.id" :cover="item.meta.picUrl" :name="item.name"
        :singer="item.singer" :class="[
          { [$style.playing]: playerInfo.isPlayList && playing && playerInfo.playIndex === index },
          { [$style.active]: playerInfo.isPlayList && playerInfo.playIndex === index }
        ]" @dblclick="handleListItemDblClick(index)"
/>
    </div>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
import { playList } from '@renderer/core/player'
import { ref } from 'vue'

export default {
  name: 'List',
  components: {
    ListItem,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    listId: {
      type: String,
      required: true,
    },
    playerInfo: {
      type: Object,
      required: true,
      default() {
        return {
          isPlayList: false,
          playIndex: -1,
        }
      },
    },
    playing: {
      type: Boolean,
    },
    columnNumber: {
      type: Number,
      default: 4,
    },
  },
  emits: ['show-menu'],
  setup(props, { emit }) {
    const activeIndex = ref(-1)

    const handleListItemDblClick = (index) => {
      activeIndex.value = index
      playList(props.listId, index)
    }

    return {
      handleListItemDblClick,
      activeIndex,
    }
  },
  data() {
    return {
      listStyles: {},
    }
  },
  created() {
    this.listStyles = {
      display: 'grid',
      gap: '4px',
      gridTemplateColumns: `repeat(${this.columnNumber - 1}, 1fr)`,
    }
  },
}

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.active {
  background-color: var(--color-050);
}

.playing {
  background: var(--color-primary-alpha-900)
}
</style>
