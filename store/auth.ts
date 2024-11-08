import { useUserStore } from '~/store/user'
import { ToastMessageType } from '~/type/constants'
import { useAuth } from '~/composables/useAuth'
import { useToastMessage } from '~/composables/useToastMessage'
import { AuthRoutes, PublicRoutes } from '~/type/routes'

export const useAuthStore = defineStore('authStore', () => {
  const userStore = useUserStore()
  const { toggleAuthDialog } = useAuth()
  const { setToastMessage } = useToastMessage()
  const router = useRouter()
  const { $apiFetch } = useNuxtApp()

  // States
  const token = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!userStore.user)

  // Actions
  const setToken = (value: string) => {
    localStorage.setItem('token', value)
    token.value = value
  }

  const getToken = () => {
    token.value = localStorage.getItem('token')
  }

  const removeToken = () => {
    localStorage.removeItem('token')
    token.value = null
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await $apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      setToken(res.token)
      userStore.user = res.user
      toggleAuthDialog(false)
      await router.replace(AuthRoutes.App)
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Vérifiez vos identifiants')
    }
  }

  const logout = async () => {
    await $apiFetch('/api/v1/auth/logout', {
      method: 'POST',
    })

    removeToken()
    userStore.user = null
    await router.replace(PublicRoutes.Home)
  }

  return {
    token,
    setToken,
    getToken,
    removeToken,
    isAuthenticated,
    logout,
    login,
  }
})
