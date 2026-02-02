<template>
  <div class="navigation-buttons">
    <div @click="go('back')" class="my__button">
      <PhCaretLeft size="45%" weight="bold" />
    </div>
    <div @click="go('forward')" class="my__button">
      <PhCaretRight size="45%" weight="bold" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from '@common/utils/vueRouter'
const router = useRouter()
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'

const go = (where) => {
  if (where === 'back') router.go(-1)
  else router.go(1)
}
</script>

<style lang="less" scoped>
@import '@renderer/assets/styles/layout.less';

.navigation-buttons {
  display: flex;
  gap: 15px;
  -webkit-app-region: no-drag;
}
</style>
