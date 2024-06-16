<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, Ref } from 'vue'

type EventType = 'mouse' | 'touch' | undefined

const stopSymbol = Symbol('rippleStop')
type RippleEvent = (MouseEvent | TouchEvent) & {
  [stopSymbol]?: boolean
}

// 波紋の広がり速度
const DURATION_MS = 300

const ripple: Ref<HTMLElement | undefined> = ref()
const eventType: Ref<EventType> = ref()

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const isTouchEvent = (e: Event): e is TouchEvent => {
  return e.constructor.name === 'TouchEvent'
}

const rippleShow = async (e: RippleEvent) => {
  // preventDefaultと同じ役割
  if (e[stopSymbol]) return;
  e[stopSymbol] = true;

  const animation = document.createElement('span')
  if (!ripple.value) return
  ripple.value.appendChild(animation)

  // 円の半径（下記なら親要素より2倍幅の円になる）
  const radius = ripple.value.clientWidth

  // NOTE: 'pointer-es-none'を付与しないと波紋要素のeを拾ってしまう
  animation.classList.add('absolute', 'rounded-full', 'scale-0', 'bg-black', 'opacity-20', 'pointer-events-none')
  animation.style.width = `${radius * 2}px`
  animation.style.height = `${radius * 2}px`

  let offsetX: number
  let offsetY: number

  if (isTouchEvent(e)) {
    const touch = e.touches[e.touches.length - 1]
    const boundingRect = ripple.value.getBoundingClientRect()
    offsetY = touch.clientY - boundingRect.top
    offsetX = touch.clientX - boundingRect.left

  } else {
    offsetY = e.offsetY
    offsetX = e.offsetX
  }

  // offsetの値をそのまま渡すとクリックした場所が円の左上になる
  // そのため、半径の値を引くことでクリックした場所が円の中心になるようにしている
  animation.style.top = `${offsetY - radius}px`
  animation.style.left = `${offsetX - radius}px`

  await sleep(1)
  animation.style.transitionDuration = `${DURATION_MS}ms`
  animation.classList.add('scale-100')

  await sleep(DURATION_MS)
  if (!ripple.value) return; // 先に遷移が走ってremoveできない
  ripple.value.removeChild(animation)
}

const rippleAnimation = (type: EventType, e: RippleEvent) => {
  // 初めに検知したイベントだけを走らせることによってイベントの波及を防ぐ
  // preventDefaultと同じ役割（preventDefaultを使うと親要素のイベントも止めてしまうため）
  if (!eventType.value) eventType.value = type
  if (eventType.value === type) {
    rippleShow(e)
  }
}

onMounted(() => {
  if (!ripple.value) return

  ripple.value.addEventListener('mousedown', (e: MouseEvent) => {
    rippleAnimation('mouse', e)
  })
  ripple.value.addEventListener('touchstart', (e: TouchEvent) => {
    rippleAnimation('touch', e)
  })
})

onBeforeUnmount(() => {
  if (!ripple.value) return

  ripple.value.removeEventListener('mousedown', (e: MouseEvent) => {
    rippleAnimation('mouse', e)
  })
  ripple.value.removeEventListener('touchstart', (e: TouchEvent) => {
    rippleAnimation('touch', e)
  })
})
</script>
<template>
  <!-- inset は CSS のプロパティで、 top, right, bottom, left に対応する一括指定です。これは margin の一括指定における複数値の場合と同じ構文です。 -->
  <!-- 引用元: https://developer.mozilla.org/ja/docs/Web/CSS/inset -->
  <!-- NOTE: insetを使うことで親要素と同じサイズに指定している -->
  <span ref="ripple" class="absolute inset-0"></span>
</template>
