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
const categories = [
  'All','Music','Lifestyle & Wellness','Gaming','Movies & Series','Education','Tech',
  'Science & Technology','Sports','News','Health & Fitness','Travel','Food','Travel & Adventure',
  'Arts & Culture','DIY & Crafts','History & Documentaries','Comedy & Entertainment',
  'Beauty & Fashion','Cars & Vehicles','Pets & Animals','Photography','Books & Literature',
  'Motivation & Self-Help','Finance & Business','Programming & Tech Tutorials'
]
const categoriesContainer = ref<HTMLDivElement | null>(null)
const scrollAmount = 200 

const scrollLeft = () => {
  if (categoriesContainer.value) {
    categoriesContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (categoriesContainer.value) {
    categoriesContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}
onMounted(fetchContents)
</script>

<template>
  <section class="min-w-7xl mx-auto transition-colors">
    <div v-if="loading" class="flex justify-center items-center h-64 text-grayCustom-500 dark:text-grayCustom-400 text-lg animate-pulse">
      {{ t('loading.videos') }}
    </div>
    <div v-else-if="filteredContents.length === 0" class="flex flex-col items-center text-center mt-20 text-grayCustom-500 dark:text-grayCustom-400">
      <span class="text-8xl mb-4">🎬</span>
      <p class="text-xl max-w-md mb-4">{{ t('empty.allVideos') }}</p>
      <NuxtLink
        to="/contents/upload"
        class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-md transition"
      >
        {{ t('uploadFirstVideo') }}
      </NuxtLink>
    </div>
    <div v-else>
<div class="relative mb-6">
  <!-- Left Arrow -->
  <button
    @click="scrollLeft"
    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-grayCustom-200 dark:bg-grayCustom-700 rounded-full shadow-md hover:bg-grayCustom-300 dark:hover:bg-grayCustom-600 transition"
  >
    <svg class="w-5 h-5 text-gray-900 dark:text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <!-- Categories Scrollable -->
  <div
    ref="categoriesContainer"
    class="flex gap-3 overflow-x-auto px-8 scrollbar-none"
  >
    <button
      v-for="(cat, i) in categories"
      :key="i"
      class="flex-shrink-0 px-4 py-2 rounded-full bg-grayCustom-100 dark:bg-grayCustom-700 text-grayCustom-900 dark:text-grayCustom-50 hover:bg-grayCustom-200 dark:hover:bg-grayCustom-600 transition whitespace-nowrap"
    >
      {{ cat }}
    </button>
  </div>

        <button
          @click="scrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-grayCustom-200 dark:bg-grayCustom-700 rounded-full shadow-md hover:bg-grayCustom-300 dark:hover:bg-grayCustom-600 transition"
        >
          <svg class="w-5 h-5 text-gray-900 dark:text-grayCustom-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ContentCard
          v-for="video in filteredContents"
          :key="video.id"
          :video="video"
          @edit="editVideo"
          @delete="deleteVideo"
        />
      </div>
    </div>
    
  </section>
</template>

<style scoped>
/* Hide scrollbar for all browsers */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
