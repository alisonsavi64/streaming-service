// stores/auth.ts
import { defineStore } from 'pinia'
import { useNuxtApp, useCookie } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as any | null,
  }),
  actions: {
    async fetchUser() {
      if (!this.token) return

      const { $api } = useNuxtApp()

      try {
        const { data } = await $api.get('/auth/me')
        this.user = data
      } catch {
        this.logout()
      }
    },

    login(token: string) {
      this.token = token
      useCookie('token').value = token
    },

    logout() {
      this.token = ''
      this.user = null
      useCookie('token').value = null
    },
  },
})
