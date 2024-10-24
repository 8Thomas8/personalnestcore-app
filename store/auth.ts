import { useUserStore } from '~/store/user'
import { ToastMessageType } from '~/type/constants'
import { useAuth } from '~/composables/useAuth'
import { useToastMessage } from '~/composables/useToastMessage'

export const useAuthStore = defineStore('authStore', () => {
  const userStore = useUserStore()
  const { toggleAuthDialog } = useAuth()
  const { setToastMessage } = useToastMessage()

  // States
  const jwt = ref(null)

  // Getters
  const isAuthenticated = computed(() => jwt.value && userStore.user)

  // Actions
  const setJwt = value => {
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
      const res = await $fetch('https://admin.mes-drugs.flamboez-server.fr/api/auth/local', {
        method: 'POST',
        body: { identifier, password },
      })

      setJwt(res.jwt)
      userStore.user = res.user
      toggleAuthDialog(false)
    } catch (e) {
      setToastMessage({ type: ToastMessageType.TypeError, text: 'Vérifiez vos identifiants' })
    }
  }

  const logout = () => {
    removeJwt()
    userStore.user = null
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
