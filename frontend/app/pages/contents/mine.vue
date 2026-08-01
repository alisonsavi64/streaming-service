<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Content } from '~/types/content'
import { contentGenres } from '~/constants/contentGenre'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const contentService = useContentService()

const contents = ref<Content[]>([])
const loading = ref(true)
const selectedGenre = ref('ALL')
const genreOptions = [{ value: 'ALL', label: 'categories.all' }, ...contentGenres]

const fetchContents = async () => {
  try {
    contents.value = await contentService.listMine()
  } catch (err: any){
    
  } finally {
    loading.value = false
  }
}

const filteredContents = computed(() => {
  const q = ((route.query.q as string) || '').toLowerCase()
  return contents.value
    .filter(v => !q || v.title.toLowerCase().includes(q))
    .filter(v => selectedGenre.value === 'ALL' || v.genre === selectedGenre.value)
})

const editVideo = (id: string) => {
  router.push(`/contents/${id}/edit`)
}

const deleteVideo = async (id: string) => {
  if (!confirm(t('confirm.deleteVideo'))) return
  await contentService.remove(id)
  contents.value = contents.value.filter(v => v.id !== id)
}

onMounted(fetchContents)
</script>

<template>
  <section class="transition-colors">
    <div
      v-if="loading"
      class="flex justify-center items-center h-64
             text-zinc-400
             text-lg animate-pulse"
    >
      {{ t('loading.videos') }}
    </div>
    <div
      v-else-if="filteredContents.length === 0"
      class="flex flex-col items-center text-center mt-32
             text-zinc-400"
    >
      <span class="text-6xl mb-4">🎬</span>
      <p class="text-lg max-w-md">
        {{ t('empty.mineVideos') }}
      </p>
    </div>
    
    <div v-else><CategoriesCarousel v-model="selectedGenre" :categories="genreOptions" />

    <h2 class="text-xl font-bold mb-4 text-white">{{ t('myvideos') }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <ContentCard
        v-for="v in filteredContents"
        :key="v.id"
        :video="v"
        @edit="editVideo"
        @delete="deleteVideo"
      />
    </div></div>
  </section>
</template>
