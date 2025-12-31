import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const token = useCookie('token').value
  if (token) {
    auth.token = token
    await auth.fetchUser()
  }
})
