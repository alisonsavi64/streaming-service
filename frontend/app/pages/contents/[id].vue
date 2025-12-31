<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const { $api } = useNuxtApp()
const route = useRoute()
const auth = useAuthStore()

const video = ref<any>(null)

onMounted(async () => {

})

const isOwner = computed(
  () => video.value?.userId === auth.user?.id
)
</script>

<template>
  <div v-if="video" class="max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl space-y-4">
    <h1 class="text-2xl font-bold">{{ video.title }}</h1>
    <p class="text-zinc-400">{{ video.description }}</p>

    <video
      v-if="video.location"
      :src="video.location"
      controls
      class="w-full rounded"
    />

    <div v-if="isOwner" class="text-sm text-green-500">
      You own this video
    </div>
  </div>
</template>
