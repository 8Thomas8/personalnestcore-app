import { defineStore } from 'pinia'
import { useUserStore } from '~/store/user'

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
      const userStore = useUserStore()
      await $fetch('http://localhost:3333/api/v1/login', {
        method: 'POST',
        body: { email, password },
      })
      this.checkAuth(true)
      await userStore.getData()
      await navigateTo('/app')
    },
    async logout() {
      const { setUser } = useUserStore()

      await $fetch('http://localhost:3333/api/v1/logout', {
        method: 'POST',
      })

      await navigateTo('/')

      this.isAuthenticated = false
      setUser(null)
    },
    checkAuth(forceAuth?: boolean) {
      const token = useCookie('access_token').value
      this.isAuthenticated = forceAuth || !!token
    },
  },
})
