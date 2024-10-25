import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () =>
    <{ user: User }>{
      user: {},
    },
  actions: {
    async getData() {
      const res = await $fetch('http://localhost:3333/api/v1/user/me')
      this.setUser(res)
    },
    setUser(data: User) {
      this.user['email'] = data.email
      this.user['firstname'] = data.firstname || null
      this.user['lastname'] = data.lastname || null
      this.user['nickname'] = data.nickname || null
    },
  },
})
