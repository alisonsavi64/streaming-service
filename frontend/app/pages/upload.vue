<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
    middleware: 'only-auth'
})

const title = ref('')
const description = ref('')

const videoFile = ref<File | null>(null)
const thumbnailFile = ref<File | null>(null)

const contentService = useContentService()

const handleVideoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  videoFile.value = target.files?.[0] ?? null
}

const handleThumbnailChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  thumbnailFile.value = target.files?.[0] ?? null
}

const submit = async () => {
  if (!videoFile.value) return alert('Select a video')
  if (!thumbnailFile.value) return alert('Select a thumbnail')

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('upload', videoFile.value)
  formData.append('thumbnail', thumbnailFile.value)

  await contentService.upload(formData)
  navigateTo('/')
}
</script>

<template>
  <form
    @submit.prevent="submit"
    class="space-y-4 max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl text-white"
  >
    <h1 class="text-2xl font-bold text-center">Upload Video</h1>

    <BaseInput v-model="title" placeholder="Title" />
    <BaseInput v-model="description" placeholder="Description" />

    <div>
      <label class="block text-sm mb-1">Video</label>
      <input
        type="file"
        accept="video/*"
        @change="handleVideoChange"
        class="block w-full text-sm"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        @change="handleThumbnailChange"
        class="block w-full text-sm"
      />
    </div>

    <BaseButton class="w-full">Upload</BaseButton>
  </form>
</template>
