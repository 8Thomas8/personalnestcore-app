import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () =>
    <{ isAuthenticated: boolean }>{
      isAuthenticated: false,
    },
  actions: {
    async signin(email: string, password: string, nickname: string) {
      await $fetch('http://localhost:3333/api/v1/auth/register', {
        method: 'POST',
        body: { nickname, email, password },
      })
    },
    async login(email: string, password: string) {
      await $fetch('http://localhost:3333/api/v1/login', {
        method: 'POST',
        body: { email, password },
      })
      this.checkAuth(true)
      navigateTo('/')
    },
    async logout() {
      await $fetch('http://localhost:3333/api/v1/logout', {
        method: 'POST',
      })
      navigateTo('/')
      this.isAuthenticated = false
    },
    checkAuth(forceAuth?: boolean) {
      const token = useCookie('access_token').value
      this.isAuthenticated = forceAuth || !!token
    },
  },
})
