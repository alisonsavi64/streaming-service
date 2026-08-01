<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'only-auth',
  layout: "default-no-aside"
})

const { t } = useI18n()

const auth = useAuthStore()
const authService = useAuthService()
const userService = useUserService()
const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const password = ref('')

const updateUser = async () => {
  await userService.update(name.value, email.value, password.value)
  await authService.logout()
}

const deleteUser = async () => {
  if (!confirm(t('profilePage.confirmDelete'))) return
  await userService.remove()
  authService.logout()
  navigateTo('/contents/mine')
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
      @submit.prevent="updateUser"
      class="relative w-full max-w-lg p-8 rounded-2xl
             bg-grayCustom-900
             border border-grayCustom-800
             shadow-none
             space-y-6 transition-colors"
    >
      <div class="w-10 h-1 rounded-full bg-primary mx-auto" aria-hidden="true" />

      <h1 class="text-3xl font-bold text-center text-white">
        {{ t('profilePage.title') }}
      </h1>

      <BaseInput v-model="name" :label="t('profilePage.name')" />
      <BaseInput v-model="email" :label="t('profilePage.email')" type="email" />
      <BaseInput v-model="password" :label="t('profilePage.password')" type="password" :placeholder="t('profilePage.passwordPlaceholder')" />
      <BaseButton type="submit" :label="t('profilePage.update')" />
      <BaseButton
        class="bg-red-600 hover:bg-red-700"
        @click.prevent="deleteUser"
      >
        {{ t('profilePage.delete') }}
      </BaseButton>
    </form>
  </div>
</template>
