<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'
import ContentCard from '~/components/ContentCard.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()
const contentService = useContentService()

const contents = ref<any[]>([])
const loading = ref(true)

const fetchContents = async () => {
  try {
    contents.value = await contentService.list()
  } catch (err) {
    console.error('Failed to fetch contents', err)
  } finally {
    loading.value = false
  }
}

const filteredContents = computed(() => {
  const q = (route.query.q as string || '').toLowerCase()
  if (!q) return contents.value
  return contents.value.filter(v =>
    v.title.toLowerCase().includes(q)
  )
})

const deleteVideo = async (id: string) => {
  if (!confirm(t('confirm.deleteVideo'))) return
  await contentService.remove(id)
  contents.value = contents.value.filter(v => v.id !== id)
}

const editVideo = (id: string) => router.push(`/contents/${id}/edit`)
const goToVideo = (id: string) => router.push(`/contents/${id}`)

onMounted(fetchContents)
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-8 transition-colors">
    
    <!-- Loading -->
    <div
      v-if="loading"
      class="flex justify-center items-center h-64
             text-zinc-500 dark:text-zinc-400 text-lg animate-pulse"
    >
      {{ t('loading.videos') }}
    </div>

    <!-- Empty state -->
    <div
      v-else-if="filteredContents.length === 0"
      class="flex flex-col items-center text-center mt-32
             text-zinc-500 dark:text-zinc-400"
    >
      <span class="text-6xl mb-4">🎬</span>
      <p class="text-lg max-w-md">
        {{ t('empty.allVideos') }}
      </p>
    </div>

    <!-- Grid of videos -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ContentCard
        v-for="video in filteredContents"
        :key="video.id"
        :video="video"
        @edit="editVideo"
        @delete="deleteVideo"
      />
    </div>
  </section>
</template>

