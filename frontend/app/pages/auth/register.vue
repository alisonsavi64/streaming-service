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

  // Call service to create user
  await userService.create(name.value, email.value, password.value)
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="flex items-center justify-center px-4 py-12 transition-colors">
    <form
      @submit.prevent="submit"
      class="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-6
             shadow-lg dark:shadow-none transition-colors"
    >
      <h1 class="text-2xl font-bold text-center text-zinc-900 dark:text-white">
        {{ t('auth.registerTitle') }}
      </h1>

      <!-- Name -->
      <BaseInput
        v-model="name"
        :label="t('auth.name')"
        placeholder="e.g. John Doe"
      />

      <!-- Email -->
      <BaseInput
        v-model="email"
        :label="t('auth.email')"
        type="email"
        placeholder="example@mail.com"
      />

      <!-- Password -->
      <BaseInput
        v-model="password"
        :label="t('auth.password')"
        type="password"
        placeholder="••••••••"
      />

      <!-- Confirm Password -->
      <BaseInput
        v-model="confirmPassword"
        :label="t('auth.confirmPassword')"
        type="password"
        placeholder="••••••••"
      />

      <!-- Submit Button -->
      <BaseButton type="submit">
        {{ t('auth.registerTitle') }}
      </BaseButton>

      <!-- Already have account -->
      <p class="text-sm text-center text-zinc-600 dark:text-zinc-400">
        {{ t('auth.alreadyHaveAccount') }}
        <NuxtLink
          to="/auth/login"
          class="text-primary dark:text-indigo-400 font-semibold hover:underline"
        >
          {{ t('auth.loginTitle') }}
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
