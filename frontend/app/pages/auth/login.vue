<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'default-no-aside', middleware: 'no-auth' })

const { t } = useI18n()

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
  <div class="relative flex items-center justify-center px-4 py-16 min-h-[75vh] transition-colors overflow-hidden">
    <div
      class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-[120px]"
      aria-hidden="true"
    />
    <form
      @submit.prevent="submit"
      class="relative bg-grayCustom-900 p-8 rounded-2xl w-full max-w-md space-y-6
           border border-grayCustom-800
           shadow-none transition-colors"
    >
      <div class="w-10 h-1 rounded-full bg-primary mx-auto" aria-hidden="true" />

      <h1 class="text-3xl md:text-4xl font-bold text-center text-white">
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

      <p class="text-center text-sm text-zinc-400">
        {{ t('auth.noAccount') }}
        <NuxtLink
          to="/auth/register"
          class="text-primary hover:text-primary-light font-semibold hover:underline ml-1"
        >
          {{ t('auth.createAccount') }}
        </NuxtLink>
      </p>
    </form>
    </div>
</template>
