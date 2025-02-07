import { ToastMessageType } from '~/types/constants'
import { useAuth } from '~/composables/useAuth'
import { useToastMessage } from '~/composables/useToastMessage'
import { PublicRoutes, ServiceRoutes } from '~/types/routes'
import UserDto from '~/dto/UserDto'
import { plainToInstance } from 'class-transformer'

export const useAuthStore = defineStore('authStore', () => {
  const { toggleAuthDialog } = useAuth()
  const { setToastMessage } = useToastMessage()
  const router = useRouter()
  const { $apiFetch } = useNuxtApp()

  // States
  const token = ref<string | null>(null)
  const user = ref<UserDto | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

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
      const res = await $apiFetch('/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      setToken(res.token)
      user.value = res.user
      toggleAuthDialog(false)
      await router.replace(ServiceRoutes.Drugs)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Vérifiez vos identifiants')
    }
  }

  const register = async (email: string, password: string) => {
    try {
      await $apiFetch('/v1/auth/register', {
        method: 'POST',
        body: { email, password },
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Vérifiez vos identifiants')
    }
  }

  const logout = async () => {
    await $apiFetch('/v1/auth/logout', {
      method: 'POST',
    })

    removeToken()
    user.value = null
    await router.replace(PublicRoutes.Home)
  }

  const fetchUser = async () => {
    getToken()

    if (!token.value) return

    try {
      const res = await $apiFetch('/v1/me', {
        headers: { Authorization: `Bearer ${token.value}` },
        method: 'GET',
      })

      user.value = plainToInstance(UserDto, res)
    } catch {
      removeToken()
      setToastMessage(ToastMessageType.TypeError, 'Connexion impossible')
    }
  }

  const adminCanRegister = async () => {
    try {
      const res = await $apiFetch('/v1/admin-can-register')
      return res === 'true'
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de vérifier si un administrateur peut être créé.')
      return false
    }
  }

  return {
    fetchUser,
    user,
    token,
    setToken,
    getToken,
    removeToken,
    isAuthenticated,
    logout,
    login,
    register,
    adminCanRegister,
  }
})
