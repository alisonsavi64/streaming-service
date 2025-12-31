<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const name = ref('')
const email = ref('')
const password = ref('')
const userService = useUserService()

const submit = async () => {
  await userService.create(name.value, email.value, password.value)
  navigateTo('/login')
}
</script>

<template>
  <form @submit.prevent="submit" class="bg-zinc-900 p-8 rounded-2xl w-96 space-y-4">
    <h1 class="text-2xl font-bold text-center">Criar conta</h1>

    <BaseInput v-model="name" placeholder="Nome" />
    <BaseInput v-model="email" placeholder="E-mail" />
    <BaseInput v-model="password" type="password" placeholder="Senha" />

    <BaseButton>Criar conta</BaseButton>
  </form>
</template>
