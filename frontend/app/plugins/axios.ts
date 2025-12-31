import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { useCookie } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  const api = axios.create({
    baseURL: 'http://100.109.45.123:3001',
  })

  api.interceptors.request.use(config => {
    const token = auth.token || useCookie('token').value
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return {
    provide: { api },
  }
})
