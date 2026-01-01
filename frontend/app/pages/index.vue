<template>
  <section class="max-w-7xl mx-auto text-zinc-900 dark:text-white transition-colors">
    <div
      v-if="loading"
      class="flex justify-center items-center h-64
             text-zinc-500 dark:text-zinc-400
             text-lg animate-pulse"
    >
      Loading videos…
    </div>

    <!-- Empty -->
    <div
      v-else-if="filteredContents.length === 0"
      class="flex flex-col items-center text-center mt-32
             text-zinc-500 dark:text-zinc-400"
    >
      <span class="text-6xl mb-4">🎬</span>
      <p class="text-lg max-w-md">
        No videos yet. Upload the first one and kick things off.
      </p>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <article
        v-for="v in filteredContents"
        :key="v.id"
        class="group rounded-xl overflow-hidden border transition
               bg-white border-zinc-200 text-zinc-900
               dark:bg-zinc-900 dark:border-zinc-800 dark:text-white
               hover:shadow-xl"
      >
        <!-- Thumbnail -->
        <div
          @click="goToVideo(v.id)"
          class="cursor-pointer relative"
        >
          <img
            :src="v.thumbnailUrl"
            class="h-44 w-full object-cover"
          />

          <!-- Hover overlay -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition"
          />
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="font-semibold text-sm truncate">
            {{ v.title }}
          </h3>

          <p class="text-xs mt-1 line-clamp-2
                    text-zinc-600 dark:text-zinc-400">
            {{ v.description }}
          </p>

          <!-- Owner actions -->
          <div
            v-if="v.userId === auth.user?.id"
            class="flex gap-2 mt-4"
          >
            <button
              @click="editVideo(v.id)"
              class="px-3 py-1 text-xs rounded-md
                     bg-blue-600 hover:bg-blue-700
                     text-white transition"
            >
              Edit
            </button>
            <button
              @click="deleteVideo(v.id)"
              class="px-3 py-1 text-xs rounded-md
                     bg-red-600 hover:bg-red-700
                     text-white transition"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const auth = useAuthStore()
const contentService = useContentService()

const contents = ref<any[]>([])
const search = ref('')
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

const deleteVideo = async (id: string) => {
  if (!confirm('Delete this video?')) return
  await contentService.remove(id)
  contents.value = contents.value.filter(v => v.id !== id)
}

const editVideo = (id: string) => router.push(`/contents/${id}/edit`)
const goToVideo = (id: string) => router.push(`/contents/${id}`)
const route = useRoute()
const filteredContents = computed(() => {
  const q = (route.query.q as string || '').toLowerCase()
  if (!q) return contents.value
  return contents.value.filter(v =>
    v.title.toLowerCase().includes(q)
  )
})

onMounted(fetchContents)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
