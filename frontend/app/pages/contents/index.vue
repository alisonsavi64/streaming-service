<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/store/auth'


definePageMeta({
    middleware: 'only-auth'
})

const router = useRouter()
const auth = useAuthStore()
const authService = useAuthService()
const contents = ref<any[]>([])
const loading = ref(true)

const fetchContents = async () => {
  await authService.me()
}

const deleteVideo = async (id: string) => {
  if (!confirm('Are you sure?')) return
  contents.value = contents.value.filter(v => v.id !== id)
}

const goToVideo = (id: string) => router.push(`/contents/${id}`)

onMounted(fetchContents)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Vídeos</h1>
    <div v-if="loading" class="text-zinc-400 text-center">Loading...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="v in contents" :key="v.id" class="group relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer">
        <div @click="goToVideo(v.id)">
          <img :src="v.thumbnail" class="h-40 w-full object-cover group-hover:scale-105 transition"/>
          <div class="p-4">
            <p class="font-medium group-hover:text-primary">{{ v.title }}</p>
            <p class="text-sm text-zinc-400">{{ v.description }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
