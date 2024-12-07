<template>
    <img :src="src" :width="width" :height="height" :style="{'border-radius': radius + 'px'}">
</template>
<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 50,
  },
  height: {
    type: Number,
    default: 50,
  },
  radius: {
    type: Number,
    default: 0,
  },
})
</script>

<style lang="less" scoped>
</style>
