<template>
  <div class="min-h-screen bg-secondary text-gray-50">
    <header class="sticky top-0 z-50 backdrop-blur-md bg-secondary/90
             border-b border-grayCustom-800">
      <div class="px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3 sm:gap-6">
        <NuxtLink to="/" class="text-2xl font-bold text-primary">
          WatchTube
        </NuxtLink>
        <div class="order-3 sm:order-none w-full sm:flex-1 sm:max-w-xl">
          <input v-model="search" @keyup.enter="goSearch" type="text" :placeholder="t('search')" class="w-full px-4 py-2 rounded-full border border-grayCustom-300
                   bg-grayCustom-800 text-white
                   placeholder-grayCustom-400 focus:outline-none focus:ring-2 focus:ring-primary transition" />
        </div>
        <div class="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
          <select v-model="locale" @change="onLocaleChange" class="px-3 py-2 rounded-lg text-sm border border-grayCustom-300
                   bg-grayCustom-800 border-grayCustom-700 focus:outline-none">
            <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.name }}</option>
          </select>
          <NuxtLink to="/contents/upload" title="Upload"
            class="p-2 rounded-full bg-primary hover:bg-primary-dark text-zinc-950 transition shadow-md">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </NuxtLink>
          <div class="relative">
            <button @click="toggleDropdown"
              class="flex items-center gap-2 p-2 rounded-full bg-grayCustom-800 border border-grayCustom-700 hover:bg-grayCustom-700 transition">
              <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
            </button>
            <div v-show="dropdownOpen" class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden
                     bg-grayCustom-900 border border-grayCustom-800">
              <template v-if="auth.user">
                <NuxtLink to="/contents/mine"
                  class="block px-4 py-2 text-sm hover:bg-grayCustom-700">
                  {{ t('myvideos') }}
                </NuxtLink>
                <NuxtLink to="/user/profile"
                  class="block px-4 py-2 text-sm hover:bg-grayCustom-700">
                  {{ t('profile') }}
                </NuxtLink>
                <button @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-grayCustom-700">
                  {{ t('logout') }}
                </button>
              </template>
              <template v-else>
                <NuxtLink to="/auth/login"
                  class="block px-4 py-2 text-sm hover:bg-grayCustom-700">
                  {{ t('login') }}
                </NuxtLink>
                <NuxtLink to="/auth/register"
                  class="block px-4 py-2 text-sm hover:bg-grayCustom-700">
                  {{ t('register') }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { navigateTo } from '#app'
import { useAuthStore } from '~/store/auth'

const { t, locale, locales, setLocale } = useI18n()

const router = useRouter()
const auth = useAuthStore()
const authService = useAuthService()

const dropdownOpen = ref(false)
const search = ref('')

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
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
