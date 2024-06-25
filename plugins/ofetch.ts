import { ofetch } from 'ofetch'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(_nuxtApp => {
  const authStore = useAuthStore()
  const authDialog = useAuthDialog()
  const route = useRoute()

  globalThis.$fetch = ofetch.create({
    onRequest({ _request, options }) {
      options.credentials = 'include'
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        authStore.isAuthenticated = false
        if (route.fullPath !== '/') {
          navigateTo('/')
          authDialog.toggleAuthDialog()
        }
      }
    },
  })
})
