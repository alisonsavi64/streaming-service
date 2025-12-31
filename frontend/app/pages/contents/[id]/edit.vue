<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const auth = useAuthStore()

const video = ref<any>(null)
const loading = ref(true)
const updating = ref(false)

const isOwner = computed(() => video.value && auth.user && video.value.userId === auth.user.userId)

const fetchVideo = async () => {
  if (!auth.user) {
    router.push('/login')
    return
  }
  try {
    const { data } = await $api.get(`/contents/${route.params.id}`)
    video.value = data
  } catch (err) {
    console.error('Failed to fetch video', err)
    alert('Video not found')
    router.push('/contents')
  } finally {
    loading.value = false
  }
}

watch(
  () => auth.ready,
  (ready) => {
    if (ready) fetchVideo()
  },
  { immediate: true }
)

const updateVideo = async () => {
  if (!isOwner.value || !video.value) return
  updating.value = true
  try {
    await $api.put(`/contents/${video.value.id}`, {
      title: video.value.title,
      description: video.value.description,
    })
    alert('Video updated successfully')
  } catch (err) {
    console.error('Failed to update video', err)
    alert('Update failed')
  } finally {
    updating.value = false
  }
}

const deleteVideo = async () => {
  if (!isOwner.value || !video.value) return
  if (!confirm('Are you sure you want to delete this video?')) return
  try {
    await $api.delete(`/contents/${video.value.id}`)
    alert('Video deleted')
    router.push('/contents')
  } catch (err) {
    console.error('Failed to delete video', err)
    alert('Delete failed')
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto mt-6 p-6 bg-zinc-900 rounded-xl">
    <div v-if="loading" class="text-center text-zinc-400">Loading...</div>

    <div v-else-if="video">
      <h1 class="text-2xl font-bold mb-4">{{ video.title }}</h1>
      <p class="text-zinc-400 mb-4">{{ video.description }}</p>

      <video
        v-if="video.location"
        :src="video.location"
        controls
        class="w-full rounded mb-4"
      ></video>

      <div v-if="isOwner" class="space-y-4">
        <input
          v-model="video.title"
          class="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Title"
        />
        <textarea
          v-model="video.description"
          class="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Description"
          rows="4"
        ></textarea>

        <button
          @click="updateVideo"
          :disabled="updating"
          class="bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
        >
          Update
        </button>

        <button
          @click="deleteVideo"
          class="bg-red-600 px-4 py-2 rounded text-white"
        >
          Delete
        </button>
      </div>

      <div v-else class="text-red-500 mt-4">
        You do not have permission to edit this video.
      </div>
    </div>
  </div>
</template>
