<template>
    <button :class="['button',{['small']: small}, {['noRadius']: noRadius}, {['active']: active}]" :style="{'border-radius': radius + 'px'}">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps({
  small: {
    type: Boolean,
    default: false,
  },
  noRadius: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  radius: {
    type: Number,
    default: 10,
  },
})
</script>

<style lang="less" scoped>
.button {
    user-select: none;
    cursor: pointer;
    padding: 8px 16px;
    min-height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    background: var(--color-025);
    color: var(--color-secondary);
    transition: 0.2s;
    border: none;
    outline: none;
    &:hover {
        background-color: var(--color-primary-light-800);
        color: var(--color-primary);
    }
}

.active{
  background-color: var(--color-primary-light-800);
  color: var(--color-primary);
}
.small{
    padding: 8px 12px;
}
.noRadius{
    border-radius: 0;
}
</style>
