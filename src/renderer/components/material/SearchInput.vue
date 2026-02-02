<template>
  <div :class="$style.container">
    <div :class="[$style.search, { [$style.active]: focus }, { [$style.big]: big }, { [$style.small]: small }]">
      <div :class="$style.form">
        <button type="button" @click="handleSearch">
          <PhMagnifyingGlass size="18" />
        </button>
        <input ref="dom_input" v-model.trim="text" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur"
          @input="$emit('update:modelValue', text)" @change="sendEvent('change')" @keyup.enter="handleSearch"
          @keydown.arrow-down.arrow-up.prevent @keyup.arrow-down.prevent="handleKeyDown"
          @keyup.arrow-up.prevent="handleKeyUp" @contextmenu="handleContextMenu">
        <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
          <button v-show="text" :class="$style.close" type="button" @click="handleClearList">
            <PhX size="16" />
          </button>
        </transition>
      </div>
      <div v-if="list" :class="$style.list" :style="listStyle">
        <ul ref="dom_list" @mouseleave="selectIndex = -1">
          <li v-for="(item, index) in list" :key="item" :class="{ [$style.select]: selectIndex === index }"
            @mouseenter="selectIndex = index" @click="handleTemplistClick(index)">
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { clipboardReadText } from '@common/utils/electron'
import { HOTKEY_COMMON } from '@common/hotKey'
import { appSetting } from '@renderer/store/setting'
import { PhMagnifyingGlass, PhX } from '@phosphor-icons/vue'

export default {
  props: {
    placeholder: {
      type: String,
      default: 'search',
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    visibleList: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    focusOnMount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'event'],
  data() {
    return {
      isShow: false,
      text: '',
      selectIndex: -1,
      focus: false,
      listStyle: {
        height: 0,
      },
    }
  },
  components: {
    PhMagnifyingGlass,
    PhX,
  },
  watch: {
    list(n) {
      if (!this.visibleList) return
      if (this.selectIndex > -1) this.selectIndex = -1
      this.$nextTick(() => {
        this.listStyle.height = this.$refs.dom_list.scrollHeight + 'px'
      })
    },
    modelValue(n) {
      this.text = n
    },
    visibleList(n) {
      n ? this.showList() : this.hideList()
    },
  },
  mounted() {
    if (appSetting['search.isFocusSearchBox'] || this.focusOnMount) {
      setTimeout(() => {
        this.handleFocusInput()
      }, 100)
    }
    this.handleRegisterEvent('on')
  },
  beforeUnmount() {
    this.handleRegisterEvent('off')
  },
  methods: {
    handleRegisterEvent(action) {
      let eventHub = window.key_event
      let name = action == 'on' ? 'on' : 'off'
      // eslint-disable-next-line @typescript-eslint/unbound-method
      eventHub[name](HOTKEY_COMMON.focusSearchInput.action, this.handleFocusInput)
    },
    handleFocusInput() {
      this.$refs.dom_input.focus()
    },
    handleTemplistClick(index) {
      console.log(index)
      this.sendEvent('listClick', index)
    },
    handleFocus() {
      this.focus = true
      this.sendEvent('focus')
    },
    handleBlur() {
      setTimeout(() => {
        this.focus = false
        this.sendEvent('blur')
      }, 80)
    },
    handleSearch() {
      this.hideList()
      if (this.selectIndex < 0) {
        this.sendEvent('submit')
        return
      }
      this.sendEvent('listClick', this.selectIndex)
    },
    showList() {
      this.isShow = true
      this.listStyle.height = this.$refs.dom_list.scrollHeight + 'px'
    },
    hideList() {
      this.isShow = false
      this.listStyle.height = 0
      this.$nextTick(() => {
        this.selectIndex = -1
      })
    },
    sendEvent(action, data) {
      this.$emit('event', {
        action,
        data,
      })
    },
    handleKeyDown() {
      if (this.list.length) {
        this.selectIndex = this.selectIndex + 1 < this.list.length ? this.selectIndex + 1 : 0
      } else if (this.selectIndex > -1) {
        this.selectIndex = -1
      }
    },
    handleKeyUp() {
      if (this.list.length) {
        this.selectIndex = this.selectIndex - 1 < -1 ? this.list.length - 1 : this.selectIndex - 1
      } else if (this.selectIndex > -1) {
        this.selectIndex = -1
      }
    },
    handleContextMenu() {
      let str = clipboardReadText()
      str = str.trim()
      str = str.replace(/\t|\r\n|\n|\r/g, ' ')
      str = str.replace(/\s+/g, ' ')
      let dom_input = this.$refs.dom_input
      this.text = this.text.substring(0, dom_input.selectionStart) + str + this.text.substring(dom_input.selectionEnd, this.text.length)
      this.$emit('update:modelValue', this.text)
    },
    handleClearList() {
      this.text = ''
      this.$emit('update:modelValue', this.text)
      this.sendEvent('submit')
    },
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.container {
  position: relative;
  height: 100%;
  width: 100%;
  -webkit-app-region: no-drag;
}

.search {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: @form-radius;
  display: flex;
  flex-flow: column nowrap;
  background-color: rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(8px);

  &.active {
    background-color: var(--color-content-background);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: var(--color-font);

    .form {
      color: var(--color-font);

      input {
        color: var(--color-font);

        &::placeholder {
          color: var(--color-font-label);
        }
      }

      button {
        color: var(--color-font);
      }
    }
  }

  .form {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;

    input {
      flex: 1;
      width: 100%;
      height: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      text-indent: 0;
      padding-left: 4px;
      font-size: 14px;
      color: var(--color-font);

      &::placeholder {
        color: var(--color-font-label);
        font-size: 0.95em;
        transition: color 0.3s ease;
      }
    }

    button {
      flex: none;
      border: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      height: 100%;
      padding: 0 10px;
      color: var(--color-font-label);
      transition: color 0.2s ease, transform 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--color-primary);
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .close {
      padding: 0 8px;
      margin-right: 2px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .list {
    font-size: 13.5px;
    position: absolute;
    top: calc(100% + 6px);
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    color: var(--color-font);
    background-color: var(--color-content-background);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform-origin: top center;
    z-index: 1000;

    ul {
      overflow-y: auto;
    }

    li {
      cursor: pointer;
      padding: 10px 16px;
      transition: background-color 0.2s ease;
      line-height: 1.4;

      span {
        .mixin-ellipsis-1;
      }

      &.select,
      &:hover {
        background-color: var(--color-primary-light-100-alpha-500);
        color: var(--color-primary);
      }
    }
  }
}

.big {
  .form {
    height: 36px;

    input {
      font-size: 15px;
    }
  }
}
</style>
