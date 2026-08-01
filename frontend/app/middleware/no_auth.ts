import { useAuthStore } from '~/store/auth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.user) {
    return navigateTo('/', { replace: true })
  }
})
