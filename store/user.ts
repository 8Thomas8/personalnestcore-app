import { ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import UserDto from '~/dto/UserDto'

export const useUserStore = defineStore('userStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const users = ref<UserDto[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/user', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      users.value = res?.map((user: unknown) => plainToInstance(UserDto, user)) ?? []
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer la liste des utilisateurs')
    }
  }

  const update = async ({ id, username, password }: { id: string; username: string; password: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PATCH',
        body: { username, password },
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur modifié avec succès')
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de modifier l'utilisateur")
    }
  }

  const create = async ({ username, password }: { username: string; password: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/v1/user', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { username, password },
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur créé avec succès')
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de créer l'utilisateur")
    }
  }

  const deleteOne = async (id: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })

      setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur supprimé avec succès')
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de supprimer l'utilisateur")
    }
  }

  return {
    users,
    fetchAll,
    update,
    create,
    deleteOne,
  }
})
