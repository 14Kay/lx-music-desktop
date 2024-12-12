<template lang="pug">
dt#sync Last FM
dd.gap-top
    div
    .p(:class="$style.inputContainer")
        .p.small(:class="$style.title") API key
        div
        base-input.gap-left(:class="$style.content" :model-value="appSetting['lastFM.api_key']" type="string" placeholder="API key" @update:model-value="setApiKey")

    .p(:class="$style.inputContainer")
        .p.small(:class="$style.title") secret
        div
        base-input.gap-left(:class="$style.content" :model-value="appSetting['lastFM.secret']" type="string" placeholder="secret" @update:model-value="setSecret")

    .p(:class="$style.inputContainer")
      .p.small(:class="$style.title") session
      div
      base-input.gap-left(:class="$style.content" :model-value="appSetting['lastFM.session.key']" type="string" placeholder="session" @update:model-value="setSession")
    .p(:class="$style.desc") 如果没有 session 就填写 API key 和 secret，点击获取授权后会打开一个网页，请登录 Last FM 并授权，授权成功后点击下方的启用 Last FM 即可
    .p(:class="$style.desc") 如果已经有 session 就直接填写 session，点击启用 Last FM 即可
    .p
      base-btn.btn(:disabled="!appSetting['lastFM.api_key'] || !appSetting['lastFM.secret']" @click="openAuthUrl") {{ appSetting['lastFM.session.key'] ? '重新获取授权' : '获取授权' }}
    div(v-if="appSetting['lastFM.api_key'] && appSetting['lastFM.secret']")
    .p
      base-checkbox( id="setting_last_fm_enable" :disabled="!appSetting['lastFM.session.key']" :model-value="appSetting['lastFM.enable']" label="启用 Last FM" @update:model-value="updateSetting({ 'lastFM.enable': $event })")
</template>

<script lang="ts">
import { openUrl } from '@common/utils/electron'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { debounce } from '@common/utils'
import { dialog } from '@renderer/plugins/Dialog'
import { getLastFMToken, getLastFMSession } from '@renderer/utils/ipc'
import { ref, watch } from 'vue'

export default {
  name: 'SettingLastFM',
  setup() {
    const api_key = ref(appSetting['lastFM.api_key'])
    const secret = ref(appSetting['lastFM.secret'])
    const setApiKey = debounce(api_key => {
      updateSetting({ 'lastFM.api_key': api_key.trim() })
    }, 500)

    const setSecret = debounce(secret => {
      updateSetting({ 'lastFM.secret': secret.trim() })
    }, 500)

    const setSession = debounce(session => {
      updateSetting({ 'lastFM.session.key': session.trim() })
    }, 500)

    watch(() => appSetting['lastFM.api_key'], (new_api_key) => {
      api_key.value = new_api_key
    })

    watch(() => appSetting['lastFM.secret'], (new_secret) => {
      secret.value = new_secret
    })

    const openAuthUrl = async() => {
      const base = {
        api_key: api_key.value,
        secret: secret.value,
      }
      const { token } = await getLastFMToken(base)
      window.open(`http://www.last.fm/api/auth/?api_key=${appSetting['lastFM.api_key']}&token=${token}`)
      void dialog.confirm({
        message: '请登录 Last FM 并授权',
        confirmButtonText: '我已授权',
      }).then(async isAuth => {
        if (!isAuth) return
        updateSetting({ 'lastFM.enable': true })
        const data = await getLastFMSession({ ...base, token })
        updateSetting({ 'lastFM.session.key': data.session.key })
        updateSetting({ 'lastFM.session.name': data.session.name })
        updateSetting({ 'lastFM.session.subscriber': data.session.subscriber })
      }).catch((err) => {
        void dialog({
          message: err.message,
          confirmButtonText: window.i18n.t('play_timeout_confirm'),
        })
      })
    }

    return {
      appSetting,
      updateSetting,
      openUrl,
      setApiKey,
      setSecret,
      openAuthUrl,
      setSession,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.portInput[disabled], .hostInput[disabled] {
    opacity: .8 !important;
}
.desc{
  font-size: 13px;
  color: var(--color-400);
  margin-top: 5px;
}
.inputContainer{
  display: flex;
  align-items: center;
  .title{
    width: 50px;
  }
}

.content{
  width: 250px;
}
</style>
