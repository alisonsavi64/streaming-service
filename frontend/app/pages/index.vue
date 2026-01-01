<template>
  <div class="min-h-screen bg-zinc-950 text-white font-sans">
    <main class="p-8 max-w-7xl mx-auto">
      <div class="flex flex-col items-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-4">🎥 Explore Videos</h1>
        <input
          v-model="search"
          type="text"
          placeholder="Search videos..."
          class="px-5 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition w-full max-w-lg shadow-md"
        />
      </div>
      <div v-if="loading" class="text-zinc-400 text-center mt-20 text-lg animate-pulse">
        Loading...
      </div>
      <div v-else-if="filteredContents.length === 0" class="text-center mt-32 text-xl text-primary flex flex-col items-center gap-3">
        <span class="text-7xl animate-bounce">🎬</span>
        <p class="max-w-md">Looks like we don't have any videos yet. Be the first to upload!</p>
      </div>

      <!-- Videos Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="v in filteredContents"
          :key="v.id"
          class="group relative bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105"
        >
          <!-- Thumbnail -->
          <div @click="goToVideo(v.id)" class="cursor-pointer">
            <img
              :src="v.thumbnailUrl"
              class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div class="p-4">
              <p class="font-semibold text-lg group-hover:text-primary truncate">{{ v.title }}</p>
              <p class="text-sm text-zinc-400 mt-1 line-clamp-2">{{ v.description }}</p>
            </div>
          </div>

          <!-- Edit/Delete Buttons -->
          <div v-if="v.userId === auth.user?.id" class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="editVideo(v.id)"
              class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Edit
            </button>
            <button
              @click.stop="deleteVideo(v.id)"
              class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
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
const dropdownOpen = ref(false)

const fetchContents = async () => {
  try {
    const data = await contentService.list()
    contents.value = data
  } catch (err) {
    console.error('Failed to fetch contents', err)
  } finally {
    loading.value = false
  }
}

const deleteVideo = async (id: string) => {
  if (!confirm('Are you sure?')) return
  await contentService.remove(id)
  contents.value = contents.value.filter(v => v.id !== id)
}

const editVideo = (id: string) => router.push(`/contents/${id}/edit`)
const goToVideo = (id: string) => router.push(`/contents/${id}`)
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value)

const filteredContents = computed(() => {
  if (!search.value) return contents.value
  return contents.value.filter(c =>
    c.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(fetchContents)
</script>

<style scoped>
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
