<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '~/composables/useTheme'
definePageMeta({
  middleware: 'only-auth'
})
const { t } = useI18n()
const { isDark } = useTheme()
const title = ref('')
const description = ref('')
const videoFile = ref<File | null>(null)
const thumbnailFile = ref<File | null>(null)
const contentService = useContentService()
const submit = async () => {
  if (!videoFile.value) return alert(t('uploadPage.selectVideo'))
  if (!thumbnailFile.value) return alert(t('uploadPage.selectThumbnail'))

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('upload', videoFile.value)
  formData.append('thumbnail', thumbnailFile.value)

  await contentService.upload(formData)
  navigateTo('/contents/mine')
}
</script>

<template>
  <div
    class="flex items-center justify-center px-4 py-12
           bg-zinc-100 dark:bg-zinc-950 transition-colors"
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
