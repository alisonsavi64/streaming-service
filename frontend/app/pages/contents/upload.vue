<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  middleware: 'only-auth',
  layout: "default-no-aside"
})

const { t } = useI18n()
const { isDark } = useTheme()

const title = ref('')
const description = ref('')
const videoFile = ref<File | null>(null)
const thumbnailFile = ref<File | null>(null)

const contentService = useContentService()

const MAX_FILE_SIZE = 100 * 1024 * 1024 

const submit = async () => {
  if (!videoFile.value) {
    return Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.selectVideo'),
      icon: 'error'
    })
  }

  if (!thumbnailFile.value) {
    return Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.selectThumbnail'),
      icon: 'error'
    })
  }

  if (videoFile.value.size >= MAX_FILE_SIZE) {
    return Swal.fire({
      title: t('uploadPage.fileTooLargeTitle'),
      text: t('uploadPage.fileTooLargeText'),
      icon: 'error'
    })
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('upload', videoFile.value)
  formData.append('thumbnail', thumbnailFile.value)

  try {
    Swal.fire({
      title: t('uploadPage.uploadingTitle'),
      text: t('uploadPage.uploadingText'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
      background: isDark.value ? '#18181b' : '#fff',
      color: isDark.value ? '#fff' : '#000'
    })

    await contentService.upload(formData)

    await Swal.fire({
      title: t('common.success'),
      text: t('uploadPage.uploadSuccess'),
      icon: 'success'
    })

    navigateTo('/contents/mine')
  } catch (error) {
    Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.uploadError'),
      icon: 'error'
    })
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center px-4 py-12
            transition-colors"
  >
    <form
      @submit.prevent="submit"
      class="w-full max-w-lg p-8 rounded-2xl
             bg-white dark:bg-zinc-900
             shadow-lg dark:shadow-black/40
             space-y-6 transition-colors"
    >
      <h1 class="text-3xl font-bold text-center text-zinc-900 dark:text-white">
        {{ t('uploadPage.title') }}
      </h1>
      <BaseInput
        v-model="title"
        label="uploadPage.videoTitle"
      />
      <BaseInput
        v-model="description"
        label="uploadPage.videoDescription"
      />
      <BaseFileInput
        v-model="videoFile"
        :label="t('uploadPage.videoFile')"
        accept=",.mov,.mkv,video/*"
        :placeholder="t('uploadPage.selectVideo')"
      />
      <BaseFileInput
        v-model="thumbnailFile"
        :label="t('uploadPage.thumbnailFile')"
        accept="image/*"
        :placeholder="t('uploadPage.selectThumbnail')"
      />
      <BaseButton label="uploadPage.submit" type="submit" />
    </form>
  </div>
</template>

<style scoped>
</style>
