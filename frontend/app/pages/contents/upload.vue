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

const MAX_FILE_SIZE = 200 * 1024 * 1024 

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

  if (!title.value || !title.value.trim()) {
    return Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.enterTitle'),
      icon: 'error'
    })
  }

  if (!description.value || !description.value.trim()) {
    return Swal.fire({
      title: t('common.error'),
      text: t('uploadPage.enterDescription'),
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
  <div class="relative flex items-center justify-center px-4 py-12 transition-colors overflow-hidden">
    <div
      class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-[120px]"
      aria-hidden="true"
    />
    <form
      @submit.prevent="submit"
      class="relative w-full max-w-lg p-8 rounded-2xl
             bg-white dark:bg-grayCustom-900
             border border-grayCustom-200 dark:border-grayCustom-800
             shadow-lg dark:shadow-none
             space-y-6 transition-colors"
    >
      <div class="w-10 h-1 rounded-full bg-primary mx-auto" aria-hidden="true" />

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
