<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentService } from '../../../composables/useContentService'

const route = useRoute()
const router = useRouter()
const contentService = useContentService()

const video = ref<any>(null)
const title = ref('')
const description = ref('')
const thumbnailFile = ref<File | null>(null)
const loading = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (!id || Array.isArray(id)) {
    console.error('Invalid content ID')
    return
  }

  try {
    const data = await contentService.show(id)
    video.value = data
    title.value = data.title
    description.value = data.description
  } catch (err) {
    console.error('Failed to load video:', err)
  }
})

const handleThumbnailChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  thumbnailFile.value = target.files?.[0] ?? null
}

const updateVideo = async () => {
  if (!video.value) return
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    if (thumbnailFile.value) formData.append('thumbnail', thumbnailFile.value)

    await contentService.update(video.value.id, formData)
    alert('Video updated successfully')
    router.push(`/contents/${video.value.id}`)
  } catch (err) {
    console.error('Failed to update video:', err)
    alert('Failed to update video')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-12 p-6 bg-zinc-900 rounded-xl shadow-lg text-white">
    <h1 class="text-2xl font-bold mb-6">Edit Video</h1>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Title</label>
      <input
        v-model="title"
        type="text"
        class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Description</label>
      <textarea
        v-model="description"
        rows="4"
        class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        @change="handleThumbnailChange"
        class="w-full text-sm text-white file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1 file:mr-4 file:border-none hover:file:bg-blue-700 transition"
      />
      <div v-if="video?.thumbnailUrl" class="mt-2">
        <img
          :src="video.thumbnailUrl"
          alt="Current thumbnail"
          class="w-32 h-32 object-cover rounded border border-zinc-700"
        />
      </div>
    </div>

    <button
      @click="updateVideo"
      :disabled="loading"
      class="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold disabled:opacity-50"
    >
      {{ loading ? 'Updating...' : 'Update Video' }}
    </button>
  </div>
</template>
