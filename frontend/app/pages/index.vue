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
      <CategoriesCarousel
  :categories="[
    'All','Music','Lifestyle & Wellness','Gaming','Movies & Series','Education','Tech',
    'Science & Technology','Sports','News','Health & Fitness','Travel','Food','Travel & Adventure',
    'Arts & Culture','DIY & Crafts','History & Documentaries','Comedy & Entertainment',
    'Beauty & Fashion','Cars & Vehicles','Pets & Animals','Photography','Books & Literature',
    'Motivation & Self-Help','Finance & Business','Programming & Tech Tutorials'
  ]"
/>


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
