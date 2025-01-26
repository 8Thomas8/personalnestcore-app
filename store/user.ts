import { ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import UserDto from '~/types/dto/UserDto'

export const useUserStore = defineStore('userStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const users = ref<UserDto[]>([])

  // Actions
  const fetchUsers = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/api/v1/user', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      users.value = res?.map((user: unknown) => plainToInstance(UserDto, user)) ?? []
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        'Impossible de récupérer la liste des utilisateurs',
      )
    }
  }

  const updateUser = async ({
    id,
    email,
    password,
  }: {
    id: string
    email: string
    password: string
  }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PATCH',
        body: { email, password },
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur modifié avec succès')
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, "Impossible de modifier l'utilisateur")
    }
  }

  const createUser = async ({ email, password }: { email: string; password: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/api/v1/user', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { email, password },
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur créé avec succès')
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, "Impossible de créer l'utilisateur")
    }
  }

  const deleteUser = async (id: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur supprimé avec succès')
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, "Impossible de supprimer l'utilisateur")
    }
  }

  return {
    users,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser,
  }
})
