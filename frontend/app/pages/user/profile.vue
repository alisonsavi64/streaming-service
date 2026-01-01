<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  middleware: 'only-auth'
})

const { t } = useI18n()
const { isDark } = useTheme()

const auth = useAuthStore()
const authService = useAuthService()
const userService = useUserService()

// Form fields
const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const password = ref('')

// Update user info
const updateUser = async () => {
  await userService.update(name.value, email.value, password.value)
  alert(t('profile.userUpdated'))
}

// Delete account
const deleteUser = async () => {
  if (!confirm(t('profile.confirmDelete'))) return
  await userService.remove()
  authService.logout()
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12
           bg-zinc-100 dark:bg-zinc-950 transition-colors"
  >
    <form
      @submit.prevent="updateUser"
      class="w-full max-w-lg p-8 rounded-2xl
             bg-white dark:bg-zinc-900
             shadow-lg dark:shadow-black/40
             space-y-6 transition-colors"
    >
      <h1 class="text-3xl font-bold text-center text-zinc-900 dark:text-white">
        {{ t('profile.title') }}
      </h1>

      <!-- Inputs -->
      <BaseInput v-model="name" label="profile.name" />
      <BaseInput v-model="email" label="profile.email" type="email" />
      <BaseInput v-model="password" label="profile.password" type="password" placeholder="profile.passwordPlaceholder" />

      <!-- Buttons -->
      <BaseButton type="submit" label="profile.update" />
      <BaseButton
        class="bg-red-600 hover:bg-red-700"
        @click.prevent="deleteUser"
      >
        {{ t('profile.delete') }}
      </BaseButton>
    </form>
  </div>
</template>
