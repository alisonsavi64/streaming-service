<template>
  <article
    class="group rounded-2xl overflow-hidden border
           bg-white dark:bg-zinc-900
           border-zinc-200 dark:border-zinc-800
           transition-all duration-300
           hover:-translate-y-1 hover:shadow-2xl"
  >
    <!-- Thumbnail -->
    <div @click="goToVideo" class="cursor-pointer relative">
      <img
        :src="video.thumbnailUrl"
        class="h-44 w-full object-cover"
      />

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0
               bg-gradient-to-t from-black/50 via-black/10 to-transparent
               opacity-0 group-hover:opacity-100 transition"
      />

      <!-- Status badge -->
      <div
        class="absolute top-3 left-3 status-badge"
        :class="[statusClass, status.pulse && 'animate-pulse']"
      >
        <span
          v-if="video.status === 'PROCESSING'"
          class="h-2 w-2 rounded-full bg-white"
        />
        {{ t(status.label) }}
      </div>
    </div>

    <!-- Body -->
    <div class="p-4">
      <h3 class="font-semibold text-sm truncate">
        {{ video.title }}
      </h3>

      <p
        class="text-xs mt-1 line-clamp-2
               text-zinc-600 dark:text-zinc-400"
      >
        {{ video.description }}
      </p>

      <!-- Actions -->
      <div v-if="isOwner" class="flex gap-2 mt-4">
        <button
          @click="$emit('edit', video.id)"
          class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-blue-600 hover:bg-blue-700
                 text-white transition"
        >
          {{ t('actions.edit') }}
        </button>

        <button
          @click="$emit('delete', video.id)"
          class="flex-1 px-3 py-1 text-xs rounded-md
                 bg-red-600 hover:bg-red-700
                 text-white transition"
        >
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

const status = computed(() => contentStatusConfig[props.video.status])

const statusClass = computed(() => {
  switch (props.video.status) {
    case 'UPLOADED': return 'bg-zinc-500'
    case 'PROCESSING': return 'bg-yellow-500'
    case 'PROCESSED': return 'bg-emerald-600'
    case 'FAILED': return 'bg-red-600'
    default: return 'bg-zinc-500'
  }
})

const isOwner = computed(() => props.video.userId === auth.user?.id)

const goToVideo = () => {
  router.push(`/contents/${props.video.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-2;
}
</style>
