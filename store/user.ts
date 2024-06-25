import { defineStore } from 'pinia'
import type { User } from '~/types/User'

export const useUserStore = defineStore('user', {
  state: () =>
    <{ user: User }>{
      user: null,
    },
  actions: {
    async getData() {
      const res = await $fetch('http://localhost:3333/api/v1/user/me')
      this.setUser(res)
    },
    setUser(data: User) {
      if (!data) {
        return (this.user = null)
      }

      this.user = {
        email: data.email || null,
        firstname: data.firstname || null,
        lastname: data.lastname || null,
        nickname: data.nickname || null,
      }
    },
  },
})
