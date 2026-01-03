<template>
  <article class="group rounded-2xl overflow-hidden border
           bg-white dark:bg-grayCustom-800
           border-grayCustom-200 dark:border-grayCustom-700
           shadow-card hover:shadow-lg
           transition-all duration-300">
    <!-- Thumbnail -->
    <div @click="goToVideo" class="cursor-pointer relative">
      <img :src="video.thumbnailUrl" alt="video thumbnail" class="w-full h-52 object-cover rounded-t-2xl" />
    </div>
    <div class="p-3 flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary" @click="goToVideo">
          {{ video.title }}
        </h3>
        <span v-if="status" :class="[
          status.color, // background color from contentStatusConfig
          'text-xs px-2 py-0.5 rounded-md font-semibold flex items-center gap-1',
          status.pulse ? 'animate-pulse' : '',
          'dark:text-white',     // white text in dark mode
          'text-gray-900'        // black text in light mode
        ]">
          <template v-if="video.status === 'FAILED'">⚠️</template>
          <template v-else-if="video.status === 'PROCESSED'">✅</template>
          <template v-else-if="video.status === 'PROCESSING'">⏳</template>
          <template v-else-if="video.status === 'UPLOADED'">⬆️</template>

          {{ t(status.label) }}
        </span>
      </div>

      <!-- Author -->
      <div class="flex items-center gap-2 mt-1">
        <span class="text-xs text-grayCustom-500 dark:text-grayCustom-400 truncate">
          {{ 'UserTest' }}
        </span>
      </div>

      <!-- Views and date -->
      <div class="flex items-center gap-2 text-xs text-grayCustom-400 mt-1">
        <span>{{ 0 }} views</span>
        <span>•</span>
        <span>{{ new Date(Date.now()).toLocaleDateString() }}</span>
      </div>

      <!-- Action Buttons -->
      <div v-if="isOwner" class="flex gap-2 mt-3">
        <button @click="$emit('edit', video.id)" class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-grayCustom-300 dark:bg-grayCustom-700 hover:bg-grayCustom-400 dark:hover:bg-grayCustom-600
                 text-grayCustom-900 dark:text-grayCustom-50 transition font-semibold">
          {{ t('actions.edit') }}
        </button>

        <button @click="$emit('delete', video.id)" class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-primary hover:bg-primary-dark text-white transition font-semibold">
          {{ t('actions.delete') }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/auth'
import { contentStatusConfig } from '~/constants/contentStatus'
import type { Content } from '~/types/content'

const props = defineProps<{
  video: Content
}>()

defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const status = computed(() =>
  props.video.status ? contentStatusConfig[props.video.status] : undefined
)

const isOwner = computed(() => props.video.userId === auth.user?.id)

const goToVideo = () => {
  if (!props.video.status || (props.video.status && props.video.status === 'PROCESSED')) {
    router.push(`/contents/${props.video.id}`)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
