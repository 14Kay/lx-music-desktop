<template>
    <div class="upload">
        <input type="file" accept=".png,.jpg" @change="handleFileChange">
        <base-svg-icon icon-class="plus" />
    </div>
</template>
<script setup>
import { saveImage } from '@renderer/utils/ipc'

const emit = defineEmits(['uploaded'])
const handleFileChange = async(e) => {
  const target = e.target
  const file = target.files ? target.files[0] : null
  if (!file) return
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async(event) => {
    const result = event?.target?.result
    if (result instanceof ArrayBuffer) {
      const buffer = Buffer.from(result)
      const res = await saveImage({ name: file?.name ?? '', file: buffer })
      if (res) {
        emit('uploaded', res)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.upload {
    border: 1px dashed #ccc;
    display: inline-block;
    width: 50px;
    position: relative;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    input {
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
</style>
