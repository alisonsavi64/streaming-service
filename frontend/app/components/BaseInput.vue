<template>
  <div class="w-full relative">
    <!-- Label -->
    <label
      v-if="label"
      class="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300"
    >
      {{ t(label) }}
    </label>

    <input
      :type="currentType"
      :value="modelValue"
      @input="onInput"
      v-bind="$attrs"
      class="w-full px-4 py-3 rounded-lg
             border border-zinc-300 dark:border-zinc-700
             bg-zinc-100 dark:bg-zinc-800
             text-zinc-900 dark:text-white
             focus:outline-none focus:ring-2 focus:ring-primary
             transition pr-10" 
    />

   <button
  v-if="type === 'password'"
  type="button"
  @click="togglePassword"
  class="absolute right-3 inset-y-0 flex items-center px-1 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
>
  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <!-- Eye Off Icon -->
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 014.035-7.935M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18"/>
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <!-- Eye Icon -->
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"/>
  </svg>
</button>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PropType } from 'vue'

const { t } = useI18n()

// Props
const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  type: {
    type: String as PropType<string>,
    default: 'text'
  }
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

// Password toggle logic
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Compute input type
const currentType = computed(() => {
  if (props.type !== 'password') return props.type
  return showPassword.value ? 'text' : 'password'
})
</script>
