<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white">
    <header
      class="sticky top-0 z-40 backdrop-blur
             bg-white/90 dark:bg-zinc-950/90
             border-b border-zinc-200 dark:border-zinc-800"
    >
      <div
        class="max-w-7xl mx-auto px-6 py-3
               grid grid-cols-[auto,1fr,auto] items-center gap-6"
      >
        <NuxtLink
          to="/"
          class="text-2xl font-extrabold tracking-tight
                 bg-gradient-to-r from-primary to-indigo-500
                 bg-clip-text text-transparent whitespace-nowrap"
        >
          WatchTube
        </NuxtLink>
        <div class="flex justify-center">
          <input
            v-model="search"
            @keyup.enter="goSearch"
            type="text"
            :placeholder="t('search')"
            class="w-full max-w-xl px-5 py-2.5 rounded-xl
                   bg-zinc-100 text-zinc-900 border border-zinc-300
                   placeholder-zinc-500
                   dark:bg-zinc-900 dark:text-white dark:border-zinc-800
                   focus:outline-none focus:ring-2 focus:ring-primary
                   transition shadow-sm"
          />
        </div>
        <div class="flex items-center gap-3 justify-end relative">
          <select
            v-model="locale"
            class="px-3 py-2 rounded-lg text-sm
                   bg-zinc-100 border border-zinc-300
                   dark:bg-zinc-900 dark:border-zinc-800
                   focus:outline-none"
          >
            <option
              v-for="l in locales"
              :key="l.code"
              :value="l.code"
            >
              {{ l.name }}
            </option>
          </select>
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg border
                   bg-zinc-100 hover:bg-zinc-200 border-zinc-300
                   dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800
                   transition"
          >
            <!-- Sun -->
            <svg
              v-if="isDark"
              class="h-5 w-5 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v2m6.364.636-1.414 1.414M21 12h-2m-.636 6.364-1.414-1.414M12 21v-2m-6.364-.636 1.414-1.414M3 12h2m.636-6.364 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>

            <!-- Moon -->
            <svg
              v-else
              class="h-5 w-5 text-zinc-600 dark:text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          </button>
          <NuxtLink
            to="/upload"
            :title="t('upload')"
            class="p-2 rounded-lg bg-primary hover:bg-primary-dark
                   text-white transition shadow-md"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </NuxtLink>
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center gap-2 p-2 rounded-lg
                     bg-zinc-100 hover:bg-zinc-200 border border-zinc-300
                     dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800
                     transition"
            >
              <svg
                class="h-5 w-5 text-primary"
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
            </button>
            <div
              v-show="dropdownOpen"
              class="absolute right-0 mt-2 w-44 rounded-xl shadow-xl overflow-hidden
                     bg-white border border-zinc-200
                     dark:bg-zinc-900 dark:border-zinc-800"
            >
              <template v-if="auth.user">
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {{ t('profile') }}
                </NuxtLink>

                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm
                         text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {{ t('logout') }}
                </button>
              </template>

              <template v-else>
                <NuxtLink
                  to="/login"
                  class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {{ t('login') }}
                </NuxtLink>

                <NuxtLink
                  to="/register"
                  class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {{ t('register') }}
                </NuxtLink>

              </template>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { navigateTo } from '#app'
import { useAuthStore } from '~/store/auth'
import { useTheme } from '~/composables/useTheme'

const { t, locale, locales } = useI18n()

const router = useRouter()
const auth = useAuthStore()
const authService = useAuthService()
const { isDark, toggleTheme } = useTheme()

const dropdownOpen = ref(false)
const search = ref('')

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const goSearch = () => {
  if (!search.value) return
  router.push({ path: '/', query: { q: search.value } })
}
const logout = async () => {
  await authService.logout()
  auth.setUser(null)
  navigateTo('/')
}
</script>
