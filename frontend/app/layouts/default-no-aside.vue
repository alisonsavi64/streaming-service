<template>
  <div class="min-h-screen flex flex-col bg-grayCustom-50 dark:bg-secondary text-gray-900 dark:text-gray-50">

    <header class="sticky top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-md bg-white/90 dark:bg-secondary/90 border-b border-transparent">

<div>

  <NuxtLink 
    to="/" 
    :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-primary']"
  >
    WatchTube
  </NuxtLink>
</div>

      <div class="flex-1 max-w-xl mx-6">
        <input
          v-model="search"
          @keyup.enter="goSearch"
          type="text"
          :placeholder="t('search')"
          class="w-full px-4 py-2 rounded-full border border-grayCustom-300
                 bg-grayCustom-100 text-gray-900 dark:bg-grayCustom-900 dark:text-white
                 placeholder-grayCustom-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="toggleTheme"
          class="p-2 rounded-full border border-grayCustom-300 dark:border-grayCustom-700
                 bg-grayCustom-100 dark:bg-grayCustom-900 hover:bg-grayCustom-200 dark:hover:bg-grayCustom-700 transition"
        >
          <svg v-if="isDark" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v2m6.364.636-1.414 1.414M21 12h-2m-.636 6.364-1.414-1.414M12 21v-2m-6.364-.636 1.414-1.414M3 12h2m.636-6.364 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg v-else class="h-5 w-5 text-grayCustom-600 dark:text-grayCustom-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
          </svg>
        </button>

        <NuxtLink
          to="/contents/upload"
          title="Upload"
          class="p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition shadow-md"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v16m8-8H4"/>
          </svg>
        </NuxtLink>

        <!-- User Dropdown -->
        <div class="relative">
          <button @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 p-2 rounded-full bg-grayCustom-100 dark:bg-grayCustom-900 border border-transparent dark:border-transparent hover:bg-grayCustom-200 dark:hover:bg-grayCustom-700 transition">
            <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z"/>
            </svg>
          </button>
          <div
            v-show="dropdownOpen"
            class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden
                   bg-white border border-transparent dark:bg-grayCustom-900 dark:border-transparent"
          >
            <template v-if="auth.user">
              <NuxtLink to="/contents/mine" class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('myvideos') }}
              </NuxtLink>
              <NuxtLink to="/user/profile" class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('profile') }}
              </NuxtLink>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('logout') }}
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('login') }}
              </NuxtLink>
              <NuxtLink to="/auth/register" class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('register') }}
              </NuxtLink>
            </template>
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

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const { isDark, toggleTheme } = useTheme()

if (!isDark.value) toggleTheme()

const search = ref('')
const collapsed = ref(false)
const dropdownOpen = ref(false)
const authService = useAuthService()

const goSearch = () => {
  if (!search.value) return
  router.push({ path: '/', query: { q: search.value } })
}

const logout = async () => {
  try {
    await authService.logout()
  } catch (err) {
    console.error('Logout failed', err)
  }
  auth.setUser(null)
  navigateTo('/')
}
</script>
