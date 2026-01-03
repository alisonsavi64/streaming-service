<template>
  <div class="relative mb-6">
    <button
      @click="scrollLeft"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-grayCustom-200 dark:bg-grayCustom-700 rounded-full shadow-md hover:bg-grayCustom-300 dark:hover:bg-grayCustom-600 transition"
    >
      <svg class="w-5 h-5 text-gray-900 dark:text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div
      ref="categoriesContainer"
      class="flex gap-3 overflow-x-auto px-8 scrollbar-none"
    >
      <button
        v-for="(cat, i) in categories"
        :key="i"
        class="flex-shrink-0 px-4 py-2 rounded-full bg-grayCustom-100 dark:bg-grayCustom-700 text-grayCustom-900 dark:text-grayCustom-50 hover:bg-grayCustom-200 dark:hover:bg-grayCustom-600 transition whitespace-nowrap"
      >
        {{ cat }}
      </button>
    </div>

    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-grayCustom-200 dark:bg-grayCustom-700 rounded-full shadow-md hover:bg-grayCustom-300 dark:hover:bg-grayCustom-600 transition"
    >
      <svg class="w-5 h-5 text-gray-900 dark:text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  categories: string[]
  scrollAmount?: number
}>()

const scrollAmount = props.scrollAmount || 200
const categoriesContainer = ref<HTMLDivElement | null>(null)

const scrollLeft = () => {
  if (categoriesContainer.value) {
    categoriesContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (categoriesContainer.value) {
    categoriesContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
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
