<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { useTheme } from '~/composables/useTheme'
import { useContentService } from '../../../composables/useContentService'

definePageMeta({
  middleware: 'only-auth',
  layout: 'default-no-aside'
})

const { t } = useI18n()
const { isDark } = useTheme()
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
  } catch (err: any) {
    if(err?.statusCode == 401) router.push("/auth/login")
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

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  if (thumbnailFile.value) formData.append('thumbnail', thumbnailFile.value)

  try {
    Swal.fire({
      title: t('uploadPage.uploadingTitle'),
      text: t('uploadPage.uploadingText'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
      background: isDark.value ? '#18181b' : '#fff',
      color: isDark.value ? '#fff' : '#000'
    })

    await contentService.update(video.value.id, formData)

    await Swal.fire({
      title: t('common.success'),
      text: t('uploadPage.updateSuccess') || t('uploadPage.uploadSuccess'),
      icon: 'success'
    })

    router.push(`/contents/${video.value.id}/edit`)
  } catch (err) {
    Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.uploadError'),
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center px-4 py-12 transition-colors">
    <form
      @submit.prevent="updateVideo"
      class="w-full max-w-lg p-8 rounded-2xl
             bg-white dark:bg-zinc-900
             shadow-lg dark:shadow-black/40
             space-y-6 transition-colors"
    >
      <h1 class="text-3xl font-bold text-center text-zinc-900 dark:text-white">
        {{ t('uploadPage.editVideo') || 'Edit Video' }}
      </h1>

      <BaseInput
        v-model="title"
        :label="t('uploadPage.videoTitle') || 'Title'"
      />
      <BaseInput
        v-model="description"
        :label="t('uploadPage.videoDescription') || 'Description'"
        textarea
      />

      <BaseFileInput
        v-model="thumbnailFile"
        :label="t('uploadPage.thumbnailFile') || 'Thumbnail'"
        accept="image/*"
        :placeholder="t('uploadPage.selectThumbnail') || 'Select thumbnail...'"
      />

      <div v-if="video?.thumbnailUrl" class="mt-2 flex justify-center">
        <img
          :src="video.thumbnailUrl"
          alt="Current thumbnail"
          class="w-32 h-32 object-cover rounded border border-zinc-300 dark:border-zinc-700"
        />
      </div>

      <BaseButton
        :label="loading ? t('uploadPage.updating') || 'Updating...' : t('uploadPage.submit') || 'Update Video'"
        type="submit"
        :disabled="loading"
      />
    </form>
  </div>
</template>
