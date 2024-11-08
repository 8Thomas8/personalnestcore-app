import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'

export const useUserStore = defineStore('userStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const user = ref(null)

  // Actions
  const fetchUser = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      user.value = await $apiFetch('/api/users/me', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
    } catch (e) {
      authStore.removeToken()
      setToastMessage(ToastMessageType.TypeError, 'Connexion impossible')
    }
  }

  return {
    user,
    fetchUser,
  }
})
