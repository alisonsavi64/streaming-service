<script setup lang="ts">
const props = defineProps({
  modelValue: String, 
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :type="props.type"
    :value="props.modelValue"
    @input="onInput"
    v-bind="$attrs"
    class="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white
           border border-zinc-700
           focus:outline-none focus:ring-2 focus:ring-primary"
  />
</template>
