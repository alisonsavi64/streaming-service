<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const { $api } = useNuxtApp()
const router = useRouter()
const contents = ref<any[]>([])
const auth = useAuthStore()
const loading = ref(true)

try {
  if (!auth.user && auth.token) {
    await auth.fetchUser()
  }

  const { data } = await $api.get('/contents')
  contents.value = data
} catch (err) {
  console.error('Failed to fetch contents', err)
} finally {
  loading.value = false
}

const deleteVideo = async (id: string) => {
  if (!confirm('Are you sure?')) return
  try {
    await $api.delete(`/contents/${id}`)
    contents.value = contents.value.filter(v => v.id !== id)
  } catch (err) {
    console.error('Failed to delete video', err)
    alert('Delete failed')
  }
}

const goToVideo = (id: string) => {
  router.push(`/contents/${id}`)
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Vídeos</h1>

    <div v-if="loading" class="text-zinc-400 text-center">Loading...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="v in contents"
        :key="v.id"
        class="group relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer"
      >
        <div @click="goToVideo(v.id)">
          <img
            :src="v.thumbnail"
            class="h-40 w-full object-cover group-hover:scale-105 transition"
          />
          <div class="p-4">
            <p class="font-medium group-hover:text-primary">{{ v.title }}</p>
            <p class="text-sm text-zinc-400">{{ v.description }}</p>
          </div>
        </div>

        <div
          v-if="auth.user && v.userId === auth.user.userId"
          class="absolute top-2 right-2 flex gap-2"
        >
          <NuxtLink
            :to="`/contents/${v.id}/edit`"
            class="bg-blue-600 px-2 py-1 rounded text-sm"
          >
            Edit
          </NuxtLink>
          <button
            @click.prevent="deleteVideo(v.id)"
            class="bg-red-600 px-2 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
