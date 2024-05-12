import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(to => {
  const { isAuthenticated } = storeToRefs(useAuthStore())
  const authStore = useAuthStore()
  const authDialog = useAuthDialog()

  if (!isAuthenticated.value) {
    authStore.checkAuth()
  }

  if (!isAuthenticated.value && to.fullPath !== '/') {
    navigateTo('/')
    authDialog.toggleAuthDialog()
  }
})
