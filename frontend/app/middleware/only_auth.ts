import { useAuthStore } from '~/store/auth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.user && !to.path.startsWith('/auth/login')) {
    return navigateTo('/auth/login')
  }
})
