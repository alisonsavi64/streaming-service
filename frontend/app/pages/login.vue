<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const auth = useAuthStore()

const submit = async () => {
  await auth.login(email.value, password.value)
  navigateTo('/contents')
}
</script>

<template>
  <form @submit.prevent="submit" class="bg-zinc-900 p-8 rounded-2xl w-96 space-y-4">
    <h1 class="text-2xl font-bold text-center">Entrar</h1>

    <BaseInput v-model="email" placeholder="E-mail" />
    <BaseInput v-model="password" type="password" placeholder="Senha" />

    <BaseButton>Entrar</BaseButton>

    <NuxtLink to="/register" class="text-sm text-center block text-zinc-400 hover:text-primary">
      Criar conta
    </NuxtLink>
  </form>
</template>
