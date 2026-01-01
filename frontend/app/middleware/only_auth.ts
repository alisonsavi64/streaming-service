import { useAuthStore } from '~/store/auth'
import { navigateTo, useNuxtApp } from '#app'
import cookie from 'cookie'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const nuxtApp = useNuxtApp()

  let token: string | undefined

  if (process.server) {
    const headersCookie = nuxtApp.ssrContext?.event.node.req.headers.cookie || ''
    const parsed = cookie.parse(headersCookie)
    token = parsed.access_token
  } else {
    const parsed: Record<string, string | undefined> = {}
    document.cookie.split(';').forEach(c => {
      const [k, v] = c.split('=').map(s => s.trim())
      if (k) parsed[k] = v
    })
    token = parsed.access_token
  }
  if (!authStore.user && !token && !to.path.startsWith('/login')) {
    return navigateTo('/login')
  }
})
