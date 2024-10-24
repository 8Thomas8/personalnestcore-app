import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useAuth } from '~/composables/useAuth' // Assumes useAuth is a composable
import { useToastMessage } from '~/composables/useToastMessage' // Assumes useToastMessage is a composable

export const useUserStore = defineStore('userStore', () => {
  const { toggleAuthDialog } = useAuth()
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
    }
  }

  return {
    user,
    fetchUser,
  }
})
