<template>
  <div class="min-h-screen bg-zinc-950 text-white">
<header class="flex justify-between items-center px-8 py-4 border-b border-zinc-800 shadow-md">
      <h1 class="font-extrabold text-3xl text-gradient bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
        WatchTube
      </h1>

      <div class="flex items-center gap-4 relative">
        <!-- Upload Button -->
        <NuxtLink
          v-if="auth.user"
          to="/upload"
          class="px-4 py-2 font-semibold rounded-lg bg-primary hover:bg-primary-dark transition shadow-md hover:shadow-lg"
        >
          Upload
        </NuxtLink>

        <!-- User Dropdown -->
        <div v-if="auth.user" class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition shadow-sm hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z"
              />
            </svg>
            <span class="font-medium">{{ auth.user.name }}</span>
          </button>

          <div
            v-show="dropdownOpen"
            class="absolute right-0 mt-2 w-44 bg-zinc-900 rounded-lg shadow-lg py-2 z-50 border border-zinc-800"
          >
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-zinc-800 transition font-medium"
            >
              Logout
            </button>
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 hover:bg-zinc-800 transition font-medium"
            >
              Profile
            </NuxtLink>
          </div>
        </div>

        <!-- Login Button -->
        <NuxtLink
          v-else
          to="/login"
          class="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition shadow-md hover:shadow-lg font-semibold"
        >
          Login
        </NuxtLink>
      </div>
    </header>

    <main class="p-8">
      <slot />
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/store/auth'
import { navigateTo } from '#app'

const auth = useAuthStore()
const authService = useAuthService()
const dropdownOpen = ref(false)

const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value

const logout = async () => {
  await authService.logout()
  auth.setUser(null)
  navigateTo('/login')
}

onMounted(async () => {
  const user = await authService.me()
  auth.setUser(user)
})
</script>
