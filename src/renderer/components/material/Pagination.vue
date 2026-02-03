<template>
  <div v-if="maxPage > 1" :class="$style.pagination">
    <ul>
      <li v-if="maxPage > btnLength && page > pageEvg + 1" :class="$style.first">
        <div type="button" :aria-label="$t('pagination__page', { num: 1 })" @click="handleClick(1)">
          <PhCaretLineLeft size="1.2em" />
          <span>First</span>
        </div>
      </li>

      <li v-if="page == 1" :class="$style.disabled">
        <div>
          <PhCaretLeft size="1.2em" />
          <span>Prev</span>
        </div>
      </li>
      <li v-else>
        <div type="button" :aria-label="$t('pagination__prev')" @click="handleClick(page - 1)">
          <PhCaretLeft size="1.2em" />
          <span>Prev</span>
        </div>
      </li>
      <li v-for="p in pages" :key="p" :class="{ [$style.active]: p == page }">
        <div v-if="p === page" v-text="page" />
        <div v-else type="button" :aria-label="$t('pagination__page', { num: p })" @click="handleClick(p)" v-text="p" />
      </li>

      <li v-if="page == maxPage" :class="$style.disabled">
        <div>
          <span>Next</span>
          <PhCaretRight size="1.2em" />
        </div>
      </li>
      <li v-else>
        <div type="button" :aria-label="$t('pagination__next')" @click="handleClick(page + 1)">
          <span>Next</span>
          <PhCaretRight size="1.2em" />
        </div>
      </li>

      <li v-if="maxPage > btnLength && maxPage - page > pageEvg" :class="$style.last">
        <div type="button" :aria-label="$t('pagination__page', { num: maxPage })" @click="handleClick(maxPage)">
          <span>Last</span>
          <PhCaretLineRight size="1.2em" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from '@common/utils/vueTools'
import { PhCaretLeft, PhCaretRight, PhCaretLineLeft, PhCaretLineRight } from '@phosphor-icons/vue'
export default {
  components: {
    PhCaretLeft,
    PhCaretRight,
    PhCaretLineLeft,
    PhCaretLineRight,
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
    btnLength: {
      type: Number,
      default: 7,
    },
  },
  emits: ['btn-click'],
  setup(props, { emit }) {
    const maxPage = computed(() => {
      return Math.ceil(props.count / props.limit) || 1
    })
    const pageEvg = computed(() => {
      return Math.floor(props.btnLength / 2)
    })
    const pages = computed(() => {
      if (maxPage.value <= props.btnLength) return Array.from({ length: maxPage.value }, (_, i) => i + 1)
      let start = props.page - pageEvg.value > 1
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        ? maxPage.value - props.page < pageEvg.value + 1
          ? maxPage.value - (props.btnLength - 1)
          : props.page - pageEvg.value
        : 1
      return Array.from({ length: props.btnLength }, (_, i) => start + i)
    })

    const handleClick = (page) => {
      emit('btn-click', page)
    }

    return {
      maxPage,
      pageEvg,
      pages,
      handleClick,
    }
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.pagination {
  display: inline-block;
  border-radius: @radius-border;

  ul {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;

    // border: .0625rem solid @theme_color2;
    // border-radius: .3125rem;
    li {
      // margin-right: @padding;
      // color: var(--color-button-font);
      // border: .0625rem solid @theme_line;
      // border-radius: .3125rem;
      transition: 0.4s ease;
      transition-property: all;
      display: flex;

      // border-right: none;
      // border-right: none;


      >div {
        height: 36px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-200);
        cursor: pointer;
        background: unset;
        display: flex;
        box-sizing: border-box;
        min-width: 36px;
        align-self: center;
        font-family: Outfit !important;
      }

      &.active {
        div {
          background-color: var(--color-primary);
          color: var(--color-main-background);
        }
      }

      button {
        background-color: transparent;
        cursor: pointer;
        transition: background-color .3s ease;

        &:hover {
          background-color: var(--color-button-background-hover);
        }

        &:active {
          background-color: var(--color-primary);
        }
      }

      &.disabled {
        div {
          opacity: .3;
        }
      }

      &:first-child {

        div {
          border-top-left-radius: @radius-border;
          border-bottom-left-radius: @radius-border;
        }

        // border-right: .0625rem solid @theme_line;
      }

      &:last-child {

        div {
          border-top-right-radius: @radius-border;
          border-bottom-right-radius: @radius-border;
        }

        // border-right: .0625rem solid @theme_line;
      }

    }
  }
}
</style>
