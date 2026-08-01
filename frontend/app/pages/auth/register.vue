<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#app'
import Swal from 'sweetalert2'

definePageMeta({ layout: 'default-no-aside', middleware: 'no-auth' })

const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('') 
const userService = useUserService()

const submit = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: t('auth.fillAllFields')
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: t('auth.passwordMismatch'),
      text: t('auth.passwordMismatch')
    })
    return
  }

  try{
    await userService.create(name.value, email.value, password.value)
  } catch {
    return;
  }
  navigateTo('/auth/login')
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

      <h1 class="text-2xl font-bold text-center text-white">
        {{ t('auth.registerTitle') }}
      </h1>

      <BaseInput
        v-model="name"
        :label="t('auth.name')"
        placeholder="e.g. John Doe"
      />

      <BaseInput
        v-model="email"
        :label="t('auth.email')"
        type="email"
        placeholder="example@mail.com"
        pattern="^[^@\s]+@[^\s@]+\.[a-zA-Z]{2,}$"
      />

      <BaseInput
        v-model="password"
        :label="t('auth.password')"
        type="password"
        placeholder="••••••••"
      />

      <BaseInput
        v-model="confirmPassword"
        :label="t('auth.confirmPassword')"
        type="password"
        placeholder="••••••••"
      />

      <BaseButton type="submit">
        {{ t('auth.registerTitle') }}
      </BaseButton>

      <p class="text-sm text-center text-zinc-400">
        {{ t('auth.alreadyHaveAccount') }}
        <NuxtLink
          to="/auth/login"
          class="text-primary hover:text-primary-light font-semibold hover:underline"
        >
          {{ t('auth.loginTitle') }}
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
