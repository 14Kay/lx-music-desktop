<template lang="pug">
dt#basic {{ $t('setting__basic') }}
dd
  h3#basic_window_size {{ $t('setting__username') }}
  div
    base-input.gap-left(:class="$style.portInput" :model-value="appSetting['common.username']" type="string" :placeholder="$t('setting__username_tip')" @update:model-value="setUsername")

dd
  .gap-top
    base-checkbox(id="setting_show_animate" :model-value="appSetting['common.isShowAnimation']" :label="$t('setting__basic_show_animation')" @update:model-value="updateSetting({ 'common.isShowAnimation': $event })")
  .gap-top
    base-checkbox(id="setting_animate" :model-value="appSetting['common.randomAnimate']" :label="$t('setting__basic_animation')" @update:model-value="updateSetting({ 'common.randomAnimate': $event })")
  .gap-top
    base-checkbox(id="setting_to_tray" :model-value="appSetting['tray.enable']" :label="$t('setting__basic_to_tray')" @update:model-value="updateSetting({ 'tray.enable': $event })")
  .gap-top
    base-btn.btn(min @click="isShowPlayTimeoutModal = true") {{ $t('setting__play_timeout') }} {{ timeLabel ? ` (${timeLabel})` : '' }}

dd
  h3#basic_source {{ $t('setting__basic_source') }}
  div
    .gap-top(v-for="item in apiSources" :key="item.id")
      base-checkbox(
        :id="`setting_api_source_${item.id}`" name="setting_api_source"
        need :model-value="appSetting['common.apiSource']" :disabled="item.disabled" :value="item.id" :aria-label="item.label" @update:model-value="updateSetting({ 'common.apiSource': $event })")
        span(:class="$style.sourceLabel")
          | {{ item.name }}
          span(v-if="item.desc" :class="$style.desc") {{ item.desc }}
          span(v-if="item.statusLabel" :class="$style.status") {{ item.statusLabel }}
    .p.gap-top
      base-btn.btn(min @click="isShowUserApiModal = true") {{ $t('setting__basic_source_user_api_btn') }}

dd
  h3#basic_window_size {{ $t('setting__basic_window_size') }}
  div
    base-checkbox.gap-left(
      v-for="item in windowSizeList" :id="`setting_window_size_${item.id}`" :key="item.id"
      name="setting_window_size" need :model-value="appSetting['common.windowSizeId']" :disabled="isFullscreen" :value="item.id" :label="$t('setting__basic_window_size_' + item.name)"
      @update:model-value="updateSetting({ 'common.windowSizeId': $event })")

dd
  h3#basic_font_size {{ $t('setting__basic_font_size') }}
  div
    //- base-selection.gap-teft(:list="fontSizeList" :model-value="appSetting['common.fontSize']" @update:model-value="updateSetting({'common.fontSize': $event})")
    base-checkbox.gap-left(
      v-for="item in fontSizeList" :id="`setting_basic_font_size_${item.id}`" :key="item.id"
      name="setting_basic_font_size" need :model-value="appSetting['common.fontSize']" :value="item.id"
      :label="item.label" :disabled="isFullscreen" @update:model-value="updateSetting({ 'common.fontSize': $event })")

dd
  h3#basic_font {{ $t('setting__basic_font') }}
  div
    div(v-if="selectedFonts.length" :class="$style.fontList" )
      div(v-for="(font, index) in selectedFonts" :key="index" :class="$style.fontItem")
        span {{ font.replace(/(^"|"$)/g, '') }}
        button(:class="$style.removeBtn" @click="handleRemoveFont(index)")
          PhTrash(:size="14")
    base-selection.gap-left(:list="fontList" :model-value="''" item-key="id" item-name="label" @update:model-value="handleAddFont")

dd
  h3#basic_lang {{ $t('setting__basic_lang') }}
  div
    base-checkbox.gap-left(
      v-for="item in langList" :id="`setting_lang_${item.locale}`" :key="item.locale" name="setting_lang"
      need :model-value="appSetting['common.langId']" :value="item.locale" :label="item.name" @update:model-value="updateSetting({ 'common.langId': $event })")

dd
  h3#basic_sourcename {{ $t('setting__basic_sourcename') }}
  div
    base-checkbox.gap-left(
      v-for="item in sourceNameTypes" :id="`setting_abasic_sourcename_${item.id}`" :key="item.id"
      name="setting_basic_sourcename" need :model-value="appSetting['common.sourceNameType']" :value="item.id" :label="item.label" @update:model-value="updateSetting({ 'common.sourceNameType': $event })")
user-api-modal(v-model="isShowUserApiModal")
play-timeout-modal(v-model="isShowPlayTimeoutModal")
</template>

<script>
import { computed, ref } from '@common/utils/vueTools'
import { PhTrash } from '@phosphor-icons/vue'
import { windowSizeList, userApi, isFullscreen } from '@renderer/store'
import { langList, useI18n } from '@root/lang'
import { getSystemFonts } from '@renderer/utils/ipc'
import apiSourceInfo from '@renderer/utils/musicSdk/api-source-info'
import { useTimeout } from '@renderer/core/player/timeoutStop'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { debounce } from '@common/utils'
import UserApiModal from './UserApiModal.vue'
import PlayTimeoutModal from './PlayTimeoutModal.vue'

export default {
  name: 'SettingBasic',
  components: {
    PhTrash,
    UserApiModal,
    PlayTimeoutModal,
  },
  setup() {
    const t = useI18n()


    const isShowPlayTimeoutModal = ref(false)
    const { timeLabel } = useTimeout()

    const isShowUserApiModal = ref(false)
    const getApiStatus = () => {
      let status
      if (userApi.status) status = t('setting__basic_source_status_success')
      else if (userApi.message == 'initing') status = t('setting__basic_source_status_initing')
      else status = `${t('setting__basic_source_status_failed')}`

      return status
    }
    const apiSources = computed(() => {
      return [
        ...apiSourceInfo.map(api => ({
          id: api.id,
          name: api.name,
          label: api.name,
          disabled: api.disabled,
        })),
        ...userApi.list.map(api => ({
          id: api.id,
          name: api.name,
          label: `${api.name}${api.id == appSetting['common.apiSource'] ? `[${getApiStatus()}]` : ''}`,
          desc: [/^\d/.test(api.version) ? `v${api.version}` : api.version].filter(Boolean).join(', '),
          statusLabel: api.id == appSetting['common.apiSource'] ? `[${getApiStatus()}]` : '',
          status: api.status,
          message: api.message,
          disabled: false,
        })),
      ]
    })

    const sourceNameTypes = computed(() => {
      return [
        { id: 'real', label: t('setting__basic_sourcename_real') },
        { id: 'alias', label: t('setting__basic_sourcename_alias') },
      ]
    })


    const controlBtnPositionList = computed(() => {
      return [
        { id: 'left', name: t('setting__basic_control_btn_position_left') },
        { id: 'right', name: t('setting__basic_control_btn_position_right') },
      ]
    })

    const systemFontList = ref([])
    const fontList = computed(() => {
      return [{ id: '', label: '添加字体' }, ...systemFontList.value.map(f => ({ id: f, label: f.replace(/(^"|"$)/g, '') }))]
    })
    void getSystemFonts().then(fonts => {
      systemFontList.value = fonts
    })

    const parseFonts = (str) => {
      return str ? str.split(',').map(f => f.trim()).filter(f => f) : []
    }

    const selectedFonts = computed(() => {
      return parseFonts(appSetting['common.font'])
    })

    const handleAddFont = (font) => {
      if (!font) return
      const currentFonts = parseFonts(appSetting['common.font'])
      if (currentFonts.includes(font)) return
      currentFonts.push(font)
      updateSetting({ 'common.font': currentFonts.join(',') })
    }

    const handleRemoveFont = (index) => {
      const currentFonts = parseFonts(appSetting['common.font'])
      currentFonts.splice(index, 1)
      updateSetting({ 'common.font': currentFonts.join(',') })
    }

    const fontSizeList = computed(() => {
      return [
        { id: 14, label: t('setting__basic_font_size_14px') },
        { id: 15, label: t('setting__basic_font_size_15px') },
        { id: 16, label: t('setting__basic_font_size_16px') },
        { id: 17, label: t('setting__basic_font_size_17px') },
        { id: 18, label: t('setting__basic_font_size_18px') },
        { id: 19, label: t('setting__basic_font_size_19px') },
      ]
    })

    const setUsername = debounce(name => {
      updateSetting({ 'common.username': name.trim() })
    }, 500)
    const setAvatar = (url) => {
      updateSetting({ 'common.avatar': url })
    }
    return {
      appSetting,
      updateSetting,
      isShowPlayTimeoutModal,
      timeLabel,
      apiSources,
      isShowUserApiModal,
      windowSizeList,
      langList,
      sourceNameTypes,
      controlBtnPositionList,
      fontList,
      isFullscreen,
      fontSizeList,
      setUsername,
      setAvatar,
      selectedFonts,
      handleAddFont,
      handleRemoveFont,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.avatar {
  display: grid;
  align-items: center;
  grid-template-columns: 60px 1fr;
}

.usename {
  display: grid;
  align-items: center;
  grid-template-columns: 60px 1fr;
}

.avatarContainer {
  display: grid;
  align-items: center;
  grid-template-columns: 60px 1fr;
  margin-top: 12px
}

.theme {
  display: flex;
  flex-flow: row wrap;
  // padding: 0 15px;
  margin-bottom: -20px;

  .themeItem {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    cursor: pointer;
    // color: var(--color-primary);
    margin-right: 8px;
    transition: .3s ease;
    transition-property: color, opacity;
    margin-bottom: 18px;
    width: 86px;

    &:hover {
      opacity: .7;
    }

    &:last-child {
      margin-right: 0;
    }

    &.active {
      color: var(--color-primary-font-active);

      .bg {
        border-color: var(--color-primary-font-active);
      }

      &:hover {
        opacity: 1;
      }
    }

    .bg {
      display: block;
      width: 36px;
      height: 36px;
      margin-bottom: 5px;
      border: 2Px solid transparent;
      padding: 2Px;
      transition: border-color .3s ease;
      border-radius: 5px;

      &:after {
        display: block;
        content: ' ';
        width: 100%;
        height: 100%;
        border-radius: @radius-border;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: var(--color-primary-theme);
        background-image: var(--background-image-theme);
      }
    }

    .label {
      width: 100%;
      text-align: center;
      height: 1.2em;
    }

    &.auto {

      &.active {
        color: var(--color-primary-font-active);

        .bg {
          border-color: var(--color-primary-font-active);
        }
      }

      >.bg {
        &:after {
          content: none;
        }
      }

      .bgContent {
        position: relative;
        height: 100%;
        overflow: hidden;
        border-radius: 5px;
      }

      .light,
      .dark {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        &:after {
          display: block;
          content: ' ';
          width: 100%;
          height: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }
      }

      .light {
        &:after {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        svg {
          fill: var(--color-primary-theme-light);
        }

        &:after {
          background-color: var(--color-primary-theme-light);
          background-image: var(--background-image-theme-light);
        }
      }

      .dark {
        &:after {
          clip-path: polygon(0 100%, 100% 0, 100% 100%);
        }

        svg {
          fill: var(--color-primary-theme-dark);
        }

        &:after {
          background-color: var(--color-primary-theme-dark);
          background-image: var(--background-image-theme-dark);
        }
      }
    }

    &.add {
      >.bg {
        &:after {
          content: none;
        }

        .bgContent {
          transition: .3s ease;
          transition-property: border, color;
          box-sizing: border-box;
          border: 1Px dashed var(--color-primary-light-100-alpha-300);
          color: var(--color-primary-light-100-alpha-300);
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon {
          // position: absolute;
          // font-size: 16px;
          width: 66%;
          height: auto;
        }
      }

      .label {
        color: var(--color-primary-dark-100-alpha-300);
      }
    }

    &.moreThme {
      flex-direction: row;
      width: auto;
      gap: 5px;
      color: var(--color-primary-font-active);

      .label {
        height: auto;
      }
    }
  }
}

.sourceLabel {
  flex: auto;
  margin-left: 5px;
  line-height: 1.5;
  cursor: pointer;

  .desc {
    color: var(--color-500);
    font-size: 12px;
    margin-left: 5px;
  }

  .status {
    margin-left: 5px;
  }
}

.fontList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0;
}

.fontItem {
  display: flex;
  align-items: center;
  background: var(--color-primary-light-100-alpha-200);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-font);
}

.removeBtn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-font);
  opacity: 0.6;
  margin-left: 6px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: var(--color-primary);
  }
}
</style>
