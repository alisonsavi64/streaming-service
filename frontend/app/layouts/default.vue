<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header class="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
      <h1 class="text-xl font-bold text-primary">WatchTube</h1>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/upload"
          class="bg-green-600 px-3 py-1 rounded hover:bg-green-500 text-white text-sm"
        >
          Upload
        </NuxtLink>
        <NuxtLink
          to="/profile"
          class="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 text-white text-sm"
        >
          Profile
        </NuxtLink>
        <button
          class="text-sm text-zinc-400 hover:text-primary"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

const logout = () => auth.logout()
</script>
