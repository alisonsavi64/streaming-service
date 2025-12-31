<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const { $api } = useNuxtApp()
const route = useRoute()
const video = ref<any>(null)
const auth = useAuthStore()

onMounted(async () => {
  const { data } = await $api.get(`/contents/${route.params.id}`)
  video.value = data
})

const isOwner = computed(() => video.value?.userId === auth.user?.id)

const updateVideo = async () => {
  if (!isOwner.value) return
  await $api.put(`/contents/${video.value.id}`, { 
    title: video.value.title, 
    description: video.value.description 
  })
  alert('Video updated')
}

const deleteVideo = async () => {
  if (!isOwner.value) return
  if (!confirm('Are you sure?')) return
  await $api.delete(`/contents/${video.value.id}`)
  navigateTo('/contents')
}
</script>

<template>
  <div v-if="video" class="max-w-lg mx-auto space-y-4 p-6 bg-zinc-900 rounded-xl">
    <h1 class="text-2xl font-bold">{{ video.title }}</h1>

    <p class="text-zinc-400">{{ video.description }}</p>

    <div v-if="isOwner">
      <BaseInput v-model="video.title" placeholder="Title" />
      <BaseInput v-model="video.description" placeholder="Description" />
      <BaseButton @click="updateVideo">Update</BaseButton>
      <BaseButton class="bg-red-600" @click="deleteVideo">Delete</BaseButton>
    </div>
  </div>
</template>
