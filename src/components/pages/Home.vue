<script setup lang="ts">
import { useRouter } from 'vue-router'
import Ripple from '@/components/Ripple.vue'

const router = useRouter()

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const toAbout = async () => {
  await sleep(300)
  router.push({ name: 'About' })
}
</script>
<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <button class="bg-gray h-16 p-4 rounded overflow-hidden relative" @click="toAbout">tailwind
      <Ripple />
    </button>
  </div>
</template>
