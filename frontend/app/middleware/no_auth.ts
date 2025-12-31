import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAuthStore()

  if (store.user) {
    return navigateTo('/contents', { replace: true })
  }
})