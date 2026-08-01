<template>
  <article class="group rounded-2xl overflow-hidden border
           bg-grayCustom-800
           border-grayCustom-700
           shadow-card hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-primary
           transition-all duration-300">
    <div @click="goToVideo" class="cursor-pointer relative overflow-hidden">
      <img :src="video.thumbnailUrl" alt="video thumbnail"
        class="w-full h-52 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent
             opacity-0 group-hover:opacity-100 transition-opacity duration-300
             flex items-end p-3 pointer-events-none">
        <p class="text-xs text-grayCustom-200 line-clamp-2">{{ video.description }}</p>
      </div>
    </div>
    <div class="p-3 flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary" @click="goToVideo">
          {{ video.title }}
        </h3>
        <span v-if="status" :class="[
          status.color, // background color from contentStatusConfig
          'text-xs px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 text-white',
          status.pulse ? 'animate-pulse' : ''
        ]">
          <template v-if="video.status === 'FAILED'">⚠️</template>
          <template v-else-if="video.status === 'PROCESSED'">✅</template>
          <template v-else-if="video.status === 'PROCESSING'">⏳</template>
          <template v-else-if="video.status === 'UPLOADED'">⬆️</template>

          {{ t(status.label) }}
        </span>
      </div>

      <div class="flex items-center gap-2 mt-1">
        <span class="text-xs text-grayCustom-400 truncate">
          {{ 'UserTest' }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-xs text-grayCustom-400 mt-1">
        <span>{{ t('content.viewsCount', { count: video.viewsCount ?? 0 }) }}</span>
        <span>•</span>
        <span class="inline-flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a5.5 5.5 0 019.5-3.8A5.5 5.5 0 0121 10.5c0 4.5-6.5 8.5-9.5 10.7C8.5 19 2 15 2 10.5z" />
          </svg>
          {{ video.likesCount ?? 0 }}
        </span>
        <span v-if="video.createdAt">•</span>
        <span v-if="video.createdAt">{{ new Date(video.createdAt).toLocaleDateString() }}</span>
      </div>

      <div v-if="isOwner" class="flex gap-2 mt-3">
        <button @click="$emit('edit', video.id)" class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-grayCustom-700 hover:bg-grayCustom-600
                 text-grayCustom-50 transition font-semibold">
          {{ t('actions.edit') }}
        </button>

        <button @click="$emit('delete', video.id)" class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-red-600 hover:bg-red-700 text-white transition font-semibold">
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
