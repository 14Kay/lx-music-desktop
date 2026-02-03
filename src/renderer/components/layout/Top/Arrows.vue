<template>
  <div class="navigation-buttons">
    <div class="my__button" @click="go('back')">
      <PhCaretLeft size="45%" weight="bold" />
    </div>
    <div class="my__button" @click="go('forward')">
      <PhCaretRight size="45%" weight="bold" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from '@common/utils/vueRouter'
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'

const router = useRouter()

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
