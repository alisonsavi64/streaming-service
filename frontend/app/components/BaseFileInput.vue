<template>
  <div class="w-full">
    <label class="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
      {{ label }}
    </label>

    <div
      class="relative w-full"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @change="onFileChange"
      />

      <div
        class="flex items-center justify-between px-4 py-2 rounded-lg
               border border-zinc-300 dark:border-zinc-700
               bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white
               hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer
               select-none"
      >
        <span class="truncate">
          {{ selectedFileName || placeholder }}
        </span>
        <svg
          class="w-5 h-5 text-zinc-600 dark:text-zinc-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v16h16V4H4zm4 8h8m-4-4v8" />
        </svg>
      </div>
    </div>

    <p v-if="helper" class="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: File | null
  label: string
  accept?: string
  placeholder?: string
  helper?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const selectedFileName = ref(props.modelValue?.name || '')

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  selectedFileName.value = file?.name || ''
  emit('update:modelValue', file)
}

watch(() => props.modelValue, (val) => {
  selectedFileName.value = val?.name || ''
})
</script>

<style scoped>
input:focus + div {
  @apply ring-2 ring-primary ring-offset-1;
}
</style>
