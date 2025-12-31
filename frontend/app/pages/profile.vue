<script setup lang="ts">
definePageMeta({
  middleware: 'only-auth',
})


const { $api } = useNuxtApp()

const name = ref('')
const email = ref('')
const password = ref('')

const updateUser = async () => {

  alert('Updated')
}

const deleteUser = async () => {
  if (!confirm('Delete account?')) return

 
  navigateTo('/login')
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl space-y-4">
    <h1 class="text-2xl font-bold text-center">Profile</h1>

    <BaseInput v-model="name" />
    <BaseInput v-model="email" />
    <BaseInput v-model="password" type="password" />

    <BaseButton @click="updateUser">Update</BaseButton>
    <BaseButton class="bg-red-600" @click="deleteUser">Delete</BaseButton>
  </div>
</template>
