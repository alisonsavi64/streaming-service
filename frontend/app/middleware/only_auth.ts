import { useAuthStore } from "~/store/auth"
import { useAuthService } from "~/composables/useAuthService"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const authService = useAuthService()

  if (authStore.user) return

  try {
    const user = await authService.me()
    if (user) {
      authStore.setUser(user)
      return
    }
  } catch (err) {
    console.error('User not authenticated', err)
  }
  if (to.path !== '/') {
    return navigateTo('/', { replace: true })
  }
})
