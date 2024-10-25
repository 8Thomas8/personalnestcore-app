import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'

export const useUserStore = defineStore('userStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()

  // State
  const user = ref(null)

  // Actions
  const fetchUser = async () => {
    authStore.getJwt()

    if (!authStore.jwt) return

    try {
      user.value = await $fetch('https://admin.mes-drugs.flamboez-server.fr/api/users/me', {
        headers: { Authorization: `Bearer ${authStore.jwt}` },
        method: 'GET',
      })
    } catch (e) {
      authStore.removeJwt()
      setToastMessage(ToastMessageType.TypeError, 'Connexion impossible')
    }
  }

  return {
    user,
    fetchUser,
  }
})
