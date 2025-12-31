<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { navigateTo } from '#app'

const auth = useAuthStore()
const authService = useAuthService()
const logout = async () => {
  await authService.logout()
  auth.setUser(null)
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header class="flex justify-between px-8 py-4 border-b border-zinc-800">
      <h1 class="font-bold text-primary">WatchTube</h1>

      <div class="flex gap-4 items-center">
        <NuxtLink v-if="auth.user" to="/upload">Upload</NuxtLink>
        <NuxtLink v-if="auth.user" to="/profile">Profile</NuxtLink>
        <button v-if="auth.user" @click="logout">Logout</button>

        <NuxtLink v-else to="/login">Login</NuxtLink>
      </div>
    </header>

    <main class="p-8">
      <slot />
    </main>
  </div>
</template>
