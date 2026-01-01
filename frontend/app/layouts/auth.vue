<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useAuthStore } from '~/store/auth'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#app'

const { t, locale, locales, setLocale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const auth = useAuthStore()

const dropdownOpen = ref(false)

const onChangeLocale = (event: Event) => {
  const select = event.target as HTMLSelectElement
  setLocale(select.value as 'en' | 'pt')
}
</script>

<template>
  <div
    :class="[
      'min-h-screen flex flex-col transition-colors',
      isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-900'
    ]"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-40 backdrop-blur
             bg-white/90 dark:bg-zinc-950/90
             border-b border-zinc-200 dark:border-zinc-800"
    >
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-2xl font-extrabold tracking-tight
                 bg-gradient-to-r from-primary to-indigo-500
                 bg-clip-text text-transparent"
        >
          WatchTube
        </NuxtLink>

        <!-- Links + Theme + Language -->
        <div class="flex items-center gap-4">
          <!-- Login/Register links -->
          <template v-if="!auth.user">
            <NuxtLink
              to="/auth/login"
              class="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              {{ t('auth.loginTitle') }}
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              {{ t('auth.registerTitle') }}
            </NuxtLink>
          </template>

          <!-- Language selector -->
          <select
            v-model="locale"
            @change="onChangeLocale"
            class="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700
                   bg-zinc-100 dark:bg-zinc-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option
              v-for="l in locales"
              :key="l.code"
              :value="l.code"
            >
              {{ l.name }}
            </option>
          </select>

          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700
                   bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800
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
        </div>
      </div>
    </header>

    <!-- Content: Auth forms -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <slot />
    </main>
  </div>
</template>
