<template>
  <div :class="$style.container">
    <div v-show="!props.listInfo.noItemLabel" ref="dom_list_ref" :class="$style.listContent" class="scroll">
      <ul>
        <li v-for="item in props.listInfo.list" :key="item.id" :class="$style.item">
          <material-playlist
          :list-id="item.id"
          :cover="item.img"
          :title="item.name"
          :subtitle="`${item.author} - ${item.time}`"
          :source="item.source"
          :from-name="route.name as string"
          ></material-playlist>
        </li>
        <li v-for="(i, index) in 6" :key="index" :class="$style.item" style="margin-bottom: 0;height: 0;" />
      </ul>
      <div :class="$style.pagination">
        <material-pagination :count="props.listInfo.total" :limit="props.listInfo.limit" :page="props.listInfo.page" @btn-click="togglePage" />
      </div>
    </div>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-show="props.listInfo.noItemLabel" :class="$style.noitem">
        <p v-text="props.listInfo.noItemLabel" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@common/utils/vueTools'
import type { ListInfo } from '@renderer/store/songList/state'
import { useRoute } from '@common/utils/vueRouter'


const props = withDefaults(defineProps<{
  listInfo: ListInfo
  visibleSource?: boolean
}>(), {
  visibleSource: false,
})

const route = useRoute()

const dom_list_ref = ref<HTMLElement | null>(null)

const emit = defineEmits(['toggle-page'])

const togglePage = (page: number) => {
  emit('toggle-page', page)
}

defineExpose({
  scrollTo(top: number) {
    dom_list_ref.value?.scrollTo({
      top,
      // behavior: 'smooth',
    })
  },
  getScrollTop() {
    return dom_list_ref.value?.scrollTop ?? 0
  },
})

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

.listContent {
  display: flex;
  flex-flow: column nowrap;
  font-size: 14px;
  box-sizing: border-box;
  overflow: hidden;
  > ul {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px 24px;
    width: 100%;
    li{
      width: 100%;
    }
  }
}
.item {
  box-sizing: border-box;
  cursor: pointer;
  transition: opacity @transition-normal;
  &:hover {
    opacity: .7;
  }
}
.image {
  flex: none;
  width: 40%;
  display: flex;
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  overflow: hidden;
  opacity: .9;
  aspect-ratio: 1 / 1;

  box-shadow: 0 0 2px 0 rgba(0,0,0,.2);
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.desc {
  flex: auto;
  padding: 2px 15px 2px 7px;
  overflow: hidden;
  h4 {
    font-size: 14px;
    // height: 2.6em;
    text-align: justify;
    line-height: 1.3;
    .mixin-ellipsis-2;
  }
}
.songlist_info {
  display: flex;
  flex-flow: row nowrap;
  gap: 15px;
  margin-top: 8px;
  font-size: 12px;
  .mixin-ellipsis-1;
  text-align: justify;
  line-height: 1.2;
  // text-indent: 24px;
  color: var(--color-font-label);
  svg {
    margin-right: 2px;
  }
}
.author {
  margin-top: 6px;
  font-size: 12px;
  .mixin-ellipsis-1;
  text-align: justify;
  line-height: 1.3;
  // text-indent: 24px;
  color: var(--color-font-label);
}
.time {
  margin-top: 3px;
  font-size: 12px;
  .mixin-ellipsis-1;
  text-align: justify;
  line-height: 1.3;
  // text-indent: 24px;
  color: var(--color-font-label);
}
.pagination {
  text-align: center;
  padding: 15px 0;
  // left: 50%;
  // transform: translateX(-50%);
}
.noitem {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  // background-color: var(--color-000);

  p {
    font-size: 24px;
    color: var(--color-font-label);
  }
}

</style>
