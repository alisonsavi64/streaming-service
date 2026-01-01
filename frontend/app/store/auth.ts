import { defineStore } from 'pinia'

export const useAuthStore = defineStore('app', {
  state: () => ({
    user: null as any
  }),
  persist: true, 
  actions: {
    setUser(user: any) {
      this.user = user
    }
  }
})
