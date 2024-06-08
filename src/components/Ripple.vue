<script setup lang="ts">
import { ref } from 'vue'

const ripple = ref()
const duration = 500
const radius = ref(0)

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const rippleAnimation = async (event: MouseEvent) => {

  const animation = document.createElement('span')
  ripple.value.appendChild(animation)

  // 円の半径（親要素と同じサイズの円を作る場合）
  radius.value = ripple.value.clientWidth / 2

  // NOTE: 'pointer-events-none'を付与しないと波紋要素のeventを拾ってしまう
  animation.classList.add('absolute', 'rounded-full', 'scale-0', 'bg-black', 'opacity-30', 'pointer-events-none')
  animation.style.width = `${radius.value * 2}px`
  animation.style.height = `${radius.value * 2}px`

  // offsetの値をそのまま渡すとクリックした場所が円の左上になる
  // そのため、半径の値を引くことでクリックした場所が円の中心になるようにしている
  animation.style.top = `${event.offsetY - radius.value}px`
  animation.style.left = `${event.offsetX - radius.value}px`

  await sleep(1)
  animation.classList.add('scale-150', `duration-${duration}`)

  await sleep(duration)
  ripple.value.removeChild(animation)
}
</script>
<template>
  <!-- inset は CSS のプロパティで、 top, right, bottom, left に対応する一括指定です。これは margin の一括指定における複数値の場合と同じ構文です。 -->
  <!-- 引用元: https://developer.mozilla.org/ja/docs/Web/CSS/inset -->
  <!-- NOTE: insetを使うことで親要素と同じサイズに指定している -->
  <span ref="ripple" class="absolute inset-0" @click="rippleAnimation"></span>
</template>
