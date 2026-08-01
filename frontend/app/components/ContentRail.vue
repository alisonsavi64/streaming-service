<template>
  <section class="mb-10 group/rail">
    <h2 class="text-xl font-bold mb-3 text-white">{{ title }}</h2>
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-secondary to-transparent" />
      <div class="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-secondary to-transparent" />

      <button
        @click="scrollByAmount(-1)"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
               bg-grayCustom-800 hover:bg-grayCustom-700 shadow-md transition
               opacity-0 group-hover/rail:opacity-100"
        aria-label="Scroll left"
      >
        <svg class="w-5 h-5 text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div ref="railEl" class="flex gap-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth">
        <div
          v-for="video in videos"
          :key="video.id"
          class="flex-shrink-0 w-56 sm:w-64"
        >
          <ContentCard :video="video" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
        </div>
      </div>

      <button
        @click="scrollByAmount(1)"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
               bg-grayCustom-800 hover:bg-grayCustom-700 shadow-md transition
               opacity-0 group-hover/rail:opacity-100"
        aria-label="Scroll right"
      >
        <svg class="w-5 h-5 text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContentCard from '~/components/ContentCard.vue'
import type { Content } from '~/types/content'

defineProps<{
  title: string
  videos: Content[]
}>()

defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const railEl = ref<HTMLDivElement | null>(null)

const scrollByAmount = (direction: 1 | -1) => {
  if (!railEl.value) return
  const amount = railEl.value.clientWidth * 0.8 * direction
  railEl.value.scrollBy({ left: amount, behavior: 'smooth' })
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
