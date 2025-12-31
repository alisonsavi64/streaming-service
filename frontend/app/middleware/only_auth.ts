import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  console.log('store.user', authStore.user)
  if (!authStore.user) {
    if (to.path !== '/login') {
      return navigateTo({ path: '/login' }, { replace: true })
    }
    return
  }
  
})