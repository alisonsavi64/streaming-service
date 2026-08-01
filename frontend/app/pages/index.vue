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

const featured = computed(() =>
  contents.value.find(v => v.status === 'PROCESSED') || null
)

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
  <section class="max-w-7xl mx-auto transition-colors">
    <div v-if="loading"
      class="flex justify-center items-center h-64 text-grayCustom-400 text-lg animate-pulse">
      {{ t('loading.videos') }}
    </div>
    <div v-else-if="filteredContents.length === 0"
      class="flex flex-col items-center text-center mt-20 text-grayCustom-400">
      <span class="text-8xl mb-4">🎬</span>
      <p class="text-xl max-w-md mb-4">{{ t('empty.allVideos') }}</p>
      <NuxtLink to="/contents/upload"
        class="px-6 py-3 bg-primary hover:bg-primary-dark text-zinc-950 font-semibold rounded-full shadow-md transition">
        {{ t('uploadFirstVideo') }}
      </NuxtLink>
    </div>
    <div v-else>
      <div v-if="featured && !route.query.q"
        class="relative -mx-4 sm:mx-0 mb-10 h-[50vh] min-h-[320px] sm:rounded-2xl overflow-hidden bg-grayCustom-900">
        <img :src="featured.thumbnailUrl" alt=""
          class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
        <div class="relative h-full flex flex-col justify-end gap-3 p-6 sm:p-10 max-w-xl">
          <span class="inline-flex w-fit items-center text-xs font-semibold uppercase tracking-wider text-primary">
            {{ t('featured.badge') }}
          </span>
          <h1 class="text-2xl sm:text-4xl font-bold text-white drop-shadow-sm line-clamp-2">
            {{ featured.title }}
          </h1>
          <p class="text-sm sm:text-base text-grayCustom-200 line-clamp-2 max-w-lg">
            {{ featured.description }}
          </p>
          <button @click="goToVideo(featured.id)"
            class="inline-flex items-center gap-2 w-fit mt-2 px-6 py-3 rounded-full
                   bg-primary hover:bg-primary-dark text-zinc-950 font-semibold transition shadow-lg">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {{ t('featured.play') }}
          </button>
        </div>
      </div>

      <CategoriesCarousel :categories="[
        'categories.all',
        'categories.music',
        'categories.lifestyle',
        'categories.gaming',
        'categories.movies',
        'categories.education',
        'categories.tech',
        'categories.science',
        'categories.sports',
        'categories.news',
        'categories.health',
        'categories.travel',
        'categories.food',
        'categories.arts',
        'categories.comedy',
        'categories.beauty',
        'categories.cars',
        'categories.pets',
        'categories.photography',
        'categories.books',
        'categories.motivation',
        'categories.finance',
        'categories.programming'
      ]" />
      <h2 class="text-xl font-bold mb-4 text-white">{{ t('browse.title') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ContentCard v-for="video in filteredContents" :key="video.id" :video="video" @edit="editVideo"
          @delete="deleteVideo" />
      </div>
    </div>

  </section>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
