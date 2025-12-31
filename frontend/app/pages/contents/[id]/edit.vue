<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

definePageMeta({
    middleware: 'only-auth'
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const video = ref<any>(null)
const loading = ref(true)
const updating = ref(false)

const isOwner = computed(
  () => video.value && video.value.userId === auth.user.id
)

onMounted(async () => {

})

const updateVideo = async () => {
  updating.value = true
  updating.value = false
  alert('Updated')
}

const deleteVideo = async () => {
  if (!confirm('Delete video?')) return
  router.push('/contents')
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl">
    <div v-if="loading" class="text-center text-zinc-400">Loading...</div>

    <div v-else>
      <BaseInput v-model="video.title" />
      <BaseInput v-model="video.description" />

      <BaseButton @click="updateVideo" :disabled="updating">
        Update
      </BaseButton>

      <BaseButton class="bg-red-600" @click="deleteVideo">
        Delete
      </BaseButton>
    </div>
  </div>
</template>
