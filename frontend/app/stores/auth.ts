import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: null as string | null,
    }),
    actions: {
        async login(email: string, password: string) {
            const { $api } = useNuxtApp()
            const { data } = await $api.post('/auth/login', { email, password })
            this.token = data.token
            this.user = data.user
            localStorage.setItem('token', data.token)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            navigateTo('/login')
        }
    }
})