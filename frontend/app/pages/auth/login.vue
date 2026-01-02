<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'
import { useTheme } from '~/composables/useTheme'

definePageMeta({ layout: 'auth', middleware: 'no-auth' })

const { t } = useI18n()
const { isDark } = useTheme()

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const authService = useAuthService()

const submit = async () => {
  await authService.login(email.value, password.value)
  const user = await authService.me()
  auth.setUser(user)
  navigateTo('/')
}
</script>

<template>
    <form
      @submit.prevent="submit"
      class="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-6
           shadow-lg dark:shadow-none transition-colors"
    >
      <h1 class="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-white">
        {{ t('auth.loginTitle') }}
      </h1>

      <BaseInput
        v-model="email"
        :label="t('auth.email')"
        type="email"
        :placeholder="t('auth.emailPlaceholder')"
      />

      <BaseInput
        v-model="password"
        :label="t('auth.password')"
        type="password"
        :placeholder="t('auth.passwordPlaceholder')"
      />

      <BaseButton type="submit" :label="t('auth.login')" class="w-full py-4 text-lg" />

      <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {{ t('auth.noAccount') }}
        <NuxtLink
          to="/auth/register"
          class="text-primary dark:text-indigo-400 font-semibold hover:underline ml-1"
        >
          {{ t('auth.createAccount') }}
        </NuxtLink>
      </p>
    </form>
</template>
