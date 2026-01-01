<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Vídeos</h1>

    <div v-if="loading" class="text-zinc-400 text-center">Loading...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="v in contents" :key="v.id" class="group relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer">
        <div @click="goToVideo(v.id)">
          <img :src="v.thumbnailUrl" class="h-40 w-full object-cover group-hover:scale-105 transition"/>
          <div class="p-4">
            <p class="font-medium group-hover:text-primary">{{ v.title }}</p>
            <p class="text-sm text-zinc-400">{{ v.description }}</p>
          </div>
        </div>

        <div v-if="v.userId === auth.user.id" class="absolute top-2 right-2 flex space-x-2">
          <button @click.stop="editVideo(v.id)" class="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
          <button @click.stop="deleteVideo(v.id)" class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const auth = useAuthStore()
const contentService = useContentService()
const contents = ref<any[]>([])
const loading = ref(true)

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
  await contentService.remove(id);
  contents.value = contents.value.filter(v => v.id !== id)
}

const editVideo = (id: string) => {
  router.push(`/contents/${id}/edit`)
}

const goToVideo = (id: string) => router.push(`/contents/${id}`)

onMounted(fetchContents)
</script>
