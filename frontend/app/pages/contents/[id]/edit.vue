<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const contentService = useContentService()

const video = ref<any>(null)
const title = ref('')
const description = ref('')
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

const updateVideo = async () => {
  if (!video.value) return
  loading.value = true

  try {
    await contentService.update(video.value.id, {
      title: title.value,
      description: description.value,
    })
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

    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">Description</label>
      <textarea
        v-model="description"
        rows="4"
        class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
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
