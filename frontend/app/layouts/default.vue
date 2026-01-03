<template>
  <div class="min-h-screen flex flex-col bg-grayCustom-50 dark:bg-secondary text-gray-900 dark:text-gray-50">

    <header
      class="sticky top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-md bg-white/90 dark:bg-secondary/90 border-b border-transparent">

      <div>
        <button @click="collapsed = !collapsed"
          class="mr-4 p-2 rounded-full hover:bg-grayCustom-100 dark:hover:bg-grayCustom-800 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <NuxtLink to="/" :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-primary']">
          WatchTube
        </NuxtLink>
      </div>

      <div class="flex-1 max-w-xl mx-6">
        <input v-model="search" @keyup.enter="goSearch" type="text" :placeholder="t('search')" class="w-full px-4 py-2 rounded-full border border-grayCustom-300
                 bg-grayCustom-100 text-gray-900 dark:bg-grayCustom-900 dark:text-white
                 placeholder-grayCustom-400 focus:outline-none focus:ring-2 focus:ring-primary transition" />
      </div>
      <div class="flex items-center gap-3">
        <select v-model="locale" @change="onLocaleChange" class="px-3 py-2 rounded-lg text-sm border border-grayCustom-300
                   bg-grayCustom-100 dark:bg-grayCustom-800 dark:border-grayCustom-700 focus:outline-none">
          <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.name }}</option>
        </select>
        <button @click="toggleTheme"
          class="p-2 rounded-full border border-grayCustom-300 dark:border-grayCustom-700
                 bg-grayCustom-100 dark:bg-grayCustom-900 hover:bg-grayCustom-200 dark:hover:bg-grayCustom-700 transition">
          <svg v-if="isDark" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v2m6.364.636-1.414 1.414M21 12h-2m-.636 6.364-1.414-1.414M12 21v-2m-6.364-.636 1.414-1.414M3 12h2m.636-6.364 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg v-else class="h-5 w-5 text-grayCustom-600 dark:text-grayCustom-300" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        </button>

        <NuxtLink to="/contents/upload" title="Upload"
          class="p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition shadow-md">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </NuxtLink>

        <div class="relative">
          <button @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 p-2 rounded-full bg-grayCustom-100 dark:bg-grayCustom-900 border border-transparent dark:border-transparent hover:bg-grayCustom-200 dark:hover:bg-grayCustom-700 transition">
            <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z" />
            </svg>
          </button>
          <div v-show="dropdownOpen" class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden
                   bg-white border border-transparent dark:bg-grayCustom-900 dark:border-transparent">
            <template v-if="auth.user">
              <NuxtLink to="/contents/mine"
                class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('myvideos') }}
              </NuxtLink>
              <NuxtLink to="/user/profile"
                class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('profile') }}
              </NuxtLink>
              <button @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('logout') }}
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login"
                class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('login') }}
              </NuxtLink>
              <NuxtLink to="/auth/register"
                class="block px-4 py-2 text-sm hover:bg-grayCustom-100 dark:hover:bg-grayCustom-700">
                {{ t('register') }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>
    <div class="flex flex-1">
      <aside
        :class="['transition-all duration-300 bg-white dark:bg-secondary border-r border-transparent dark:border-transparent', collapsed ? 'w-20' : 'w-64']">
        <div class="flex flex-col h-full">
          <nav class="flex-1 mt-4 flex flex-col">
            <NuxtLink to="/"
              class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-grayCustom-100 dark:hover:bg-grayCustom-800 transition"
              :class="{ 'bg-grayCustom-200 dark:bg-grayCustom-800 font-semibold': $route.path === '/' }">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L2 10h3v8h4v-5h2v5h4v-8h3L10 2z" />
              </svg>
              <span v-if="!collapsed">Home</span>
            </NuxtLink>


            <NuxtLink v-if="auth.user" to="/contents/mine"
              class="flex items-center gap-3 px-4 py-2 mt-2 rounded-lg hover:bg-grayCustom-100 dark:hover:bg-grayCustom-800 transition"
              :class="{ 'bg-grayCustom-200 dark:bg-grayCustom-800 font-semibold': $route.path.includes('/contents/mine') }">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 10.5V6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z" />
              </svg>
              <span v-if="!collapsed">{{ t('myvideos') }}</span>
            </NuxtLink>

            <NuxtLink to="/user/profile"
              class="flex items-center gap-3 px-4 py-2 mt-2 rounded-lg hover:bg-grayCustom-100 dark:hover:bg-grayCustom-800 transition"
              :class="{ 'bg-grayCustom-200 dark:bg-grayCustom-800 font-semibold': $route.path.includes('/user/profile') }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
              <span v-if="!collapsed">{{ t('profile') }}</span>
            </NuxtLink>

            <NuxtLink to="/contents/upload"
              class="flex items-center gap-3 px-4 py-2 mt-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span v-if="!collapsed">{{ t('upload') }}</span>
            </NuxtLink>
          </nav>
        </div>
      </aside>
      <main class="flex-1 overflow-y-auto px-6 py-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { navigateTo } from '#app'
import { useAuthStore } from '~/store/auth'
import { useTheme } from '~/composables/useTheme'

const { t, locale, locales, setLocale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const search = ref('')
const collapsed = ref(false)
const dropdownOpen = ref(false)
const authService = useAuthService()
type Locale = typeof locale.value

const onLocaleChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as Locale
  setLocale(value)
}

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
