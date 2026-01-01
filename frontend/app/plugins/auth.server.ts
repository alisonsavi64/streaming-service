import { defineNuxtPlugin, useState } from '#app'
import { useApi } from '~/composables/useApi'
import type { AuthUser } from '~/types/auth'

export default defineNuxtPlugin(async () => {
  const authUser = useState<AuthUser | null>('auth_user', () => null)

  try {
    const api = useApi()
    const res = await api.get('/auth/me')

    if (res) {
      authUser.value = {
        id: res.id,
        name: res.name,
        email: res.email
      }
    }
  } catch {
    authUser.value = null
  }

  return {
    provide: {
      authUser
    }
  }
})
