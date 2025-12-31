<script setup lang="ts">
import { ref } from 'vue'
const { $api } = useNuxtApp()
const auth = useAuthStore()

const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const password = ref('')

const updateUser = async () => {
  await $api.put('/users/me', { name: name.value, email: email.value, password: password.value })
  alert('User updated')
}

const deleteUser = async () => {
  if (!confirm('Are you sure you want to delete your account?')) return
  await $api.delete('/users/me')
  auth.logout()
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4 p-6 bg-zinc-900 rounded-xl">
    <h1 class="text-2xl font-bold text-center">Edit Profile</h1>

    <BaseInput v-model="name" placeholder="Name" />
    <BaseInput v-model="email" placeholder="Email" />
    <BaseInput v-model="password" type="password" placeholder="New Password (leave blank to keep)" />

    <BaseButton @click="updateUser">Update</BaseButton>
    <BaseButton class="bg-red-600" @click="deleteUser">Delete Account</BaseButton>
  </div>
</template>
