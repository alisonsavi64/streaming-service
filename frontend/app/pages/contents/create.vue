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
const contentService = useContentService()

const submit = async () => {

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

  const data =  {'title': title.value, 'description': description.value}

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

    const contentId = await contentService.create(data)

    await Swal.fire({
      title: t('common.success'),
      text: t('uploadPage.uploadSuccess'),
      icon: 'success'
    })

    navigateTo(`/contents/${contentId}/video`)
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
      <BaseButton label="uploadPage.submit" type="submit" />
    </form>
  </div>
</template>

<style scoped>
</style>
