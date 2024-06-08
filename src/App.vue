<script setup lang="ts">
import { ref } from 'vue'
const ripple = ref()

const rippleAnimation = (event: MouseEvent) => {

  const animation = document.createElement('span')
  ripple.value.appendChild(animation)

  // 円の半径（親要素と同じサイズの円を作る場合）
  const radius = ripple.value.clientWidth / 2

  // 'pointer-events-none'を付与しないと波紋要素のeventを拾ってしまう
  animation.classList.add('absolute', 'rounded-full', 'scale-0', 'bg-black', 'opacity-30', 'pointer-events-none')
  animation.style.width = `${radius * 2}px`
  animation.style.height = `${radius * 2}px`
  animation.style.top = `${event.offsetY - radius}px`
  animation.style.left = `${event.offsetX - radius}px`

  setTimeout(() => {
    animation.classList.add('scale-150', 'duration-500')
    setTimeout(() => {
      ripple.value.removeChild(animation)

    }, 500)
  }, 1)

}
</script>
<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <button class="bg-gray h-16 p-4 rounded overflow-hidden relative" @click="rippleAnimation">tailwind<span
        ref="ripple" class="absolute inset-0 w-full h-full"></span></button>
  </div>
</template>
<style scoped></style>
