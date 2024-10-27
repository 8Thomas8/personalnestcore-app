import { useUserStore } from '~/store/user'
import { ToastMessageType } from '~/type/constants'
import { useAuth } from '~/composables/useAuth'
import { useToastMessage } from '~/composables/useToastMessage'
import { AuthRoutes, PublicRoutes } from '~/type/routes'

export const useAuthStore = defineStore('authStore', () => {
  const userStore = useUserStore()
  const { toggleAuthDialog } = useAuth()
  const { setToastMessage } = useToastMessage()
  const config = useRuntimeConfig()
  const router = useRouter()
  const { $apiFetch } = useNuxtApp()

  // States
  const jwt = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!jwt.value && !!userStore.user)

  // Actions
  const setJwt = (value: string) => {
    localStorage.setItem('jwt', value)
    jwt.value = value
  }

  const getJwt = () => {
    jwt.value = localStorage.getItem('jwt')
  }

  const removeJwt = () => {
    localStorage.removeItem('jwt')
    jwt.value = null
  }

  const login = async (identifier: string, password: string) => {
    try {
      const res = await $apiFetch('/api/auth/local', {
        method: 'POST',
        body: { identifier, password },
      })

      setJwt(res.jwt)
      userStore.user = res.user
      toggleAuthDialog(false)
      await router.replace(AuthRoutes.App)
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Vérifiez vos identifiants')
    }
  }

  const logout = async () => {
    removeJwt()
    userStore.user = null
    await router.replace(PublicRoutes.Home)
  }

  return {
    jwt,
    setJwt,
    getJwt,
    removeJwt,
    isAuthenticated,
    logout,
    login,
  }
})
