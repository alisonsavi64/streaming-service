import { defineNuxtPlugin, useRequestFetch } from '#app'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin({
  name: 'auth',
  async setup() {
    const authStore = useAuthStore()
    const requestFetch = useRequestFetch()

    try {
      const user = await requestFetch('/api/auth/me')
      authStore.setUser(user)
    } catch {
      authStore.setUser(null)
    }
  }
})
