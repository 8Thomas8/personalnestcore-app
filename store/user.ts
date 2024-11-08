import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import UserDto from '~/type/dto/UserDto'

export const useUserStore = defineStore('userStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const user = ref<UserDto>(null)

  // Actions
  const fetchUser = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/api/v1/me', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      user.value = plainToInstance(UserDto, res)
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
