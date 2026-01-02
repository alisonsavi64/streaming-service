<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  middleware: 'only-auth',
  layout: "default-no-aside"
})

const { t } = useI18n()
const { isDark } = useTheme()

const auth = useAuthStore()
const authService = useAuthService()
const userService = useUserService()
console.log(auth.user)
const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const password = ref('')

const updateUser = async () => {
  await userService.update(name.value, email.value, password.value)
}

const deleteUser = async () => {
  if (!confirm(t('profilePage.confirmDelete'))) return
  await userService.remove()
  authService.logout()
}
</script>

<template>
  <div
    class="flex items-center justify-center px-4 py-12
            transition-colors"
  >
    <form
      @submit.prevent="updateUser"
      class="w-full max-w-lg p-8 rounded-2xl
             bg-white dark:bg-zinc-900
             shadow-lg dark:shadow-black/40
             space-y-6 transition-colors"
    >
      <h1 class="text-3xl font-bold text-center text-zinc-900 dark:text-white">
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
