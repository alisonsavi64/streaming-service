<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300"
    >
      {{ t(label) }}
    </label>

    <input
      :type="type"
      :value="modelValue"
      @input="onInput"
      v-bind="$attrs"
      class="w-full px-4 py-3 rounded-lg
             border border-zinc-300 dark:border-zinc-700
             bg-zinc-100 dark:bg-zinc-800
             text-zinc-900 dark:text-white
             focus:outline-none focus:ring-2 focus:ring-primary
             transition"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PropType } from 'vue'

const { t } = useI18n()

// Properly typed props
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

// Emits v-model updates
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const type = props.type
</script>
