<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header class="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
      <h1 class="text-xl font-bold text-primary">VideoHub</h1>

      <button
        class="text-sm text-zinc-400 hover:text-primary"
        @click="logout"
      >
        Logout
      </button>
    </header>

    <main class="p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()

const logout = () => {
  auth.logout()
}
</script>
