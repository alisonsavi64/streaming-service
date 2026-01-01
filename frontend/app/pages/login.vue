<script setup lang="ts">
import { useAuthStore } from '~/store/auth';

definePageMeta({
    middleware: 'no-auth',
    layout: 'auth'
})

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const authService = useAuthService()

const submit = async () => {
  await authService.login(email.value, password.value)
  const user = await authService.me()
  auth.setUser(user);
  navigateTo('/')
}
onMounted(async () => {
  const user = await authService.me()
  if(user) {
    auth.setUser(user);
    navigateTo('/')
  }
})
</script>

<template>
  <form @submit.prevent="submit" class="bg-zinc-900 p-8 rounded-2xl w-96 space-y-4">
    <h1 class="text-2xl font-bold text-center">Entrar</h1>

    <BaseInput v-model="email" placeholder="E-mail" />
    <BaseInput v-model="password" type="password" placeholder="Senha" />

    <BaseButton>Entrar</BaseButton>

    <NuxtLink to="/register" class="block text-sm text-center text-zinc-400">
      Criar conta
    </NuxtLink>
  </form>
</template>
