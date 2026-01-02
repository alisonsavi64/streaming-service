<template>
  <button
    :type="type"
    class="w-full py-3 rounded-lg font-semibold
           bg-primary hover:bg-primary-dark
           transition text-white
           dark:bg-primary-dark dark:hover:bg-primary"
  >
    <span v-if="label">{{ t(label) }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PropType } from 'vue'

const { t } = useI18n()

const props = defineProps({
  label: {
    type: String as PropType<string>,
    default: undefined
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  }
})

const type = props.type
</script>
