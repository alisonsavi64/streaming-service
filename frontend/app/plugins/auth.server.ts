import { defineNuxtPlugin } from '#imports'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(async () => {
  const client = useApi()
  const store = useAuthStore()

  try {
    const user = await client.get('/auth/me')
    if(user) {
      store.setUser(user)
    }   
  } catch (err) {
    console.error('No user found')
  }
})