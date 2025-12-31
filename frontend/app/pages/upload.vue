<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const file = ref<File | null>(null)
const { $api } = useNuxtApp()

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  file.value = target.files?.[0] ?? null
}

const submit = async () => {
  if (!file.value) {
    alert('Select a video')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('upload', file.value)

  try {
    await $api.post('/contents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    navigateTo('/contents')
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed. Please try again.')
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4 max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl">
    <h1 class="text-2xl font-bold text-center">Upload Video</h1>

    <BaseInput v-model="title" placeholder="Title" />
    <BaseInput v-model="description" placeholder="Description" />

    <input type="file" accept="video/*" @change="handleFileChange" />

    <BaseButton>Upload</BaseButton>
  </form>
</template>
