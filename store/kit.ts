import { ApiError, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import KitDto from '~/dto/Kit'

export const useKitStore = defineStore('kitStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const kits = ref<KitDto[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/kit', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
      kits.value = res.map((kit: unknown) => plainToInstance(KitDto, kit))
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos kits')
    }
  }

  const fetchOne = async (id: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch(`/v1/kit/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
      const kit = plainToInstance(KitDto, res)

      const index = kits.value.findIndex((k) => k.id === kit.id)
      if (index !== -1) {
        kits.value[index] = kit
      } else {
        kits.value.push(kit)
      }
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer votre kit')
    }
  }

  const create = async (name: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/v1/kit', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { name },
      })
      return true
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        e.message === ApiError.API_ERROR_SIMILAR_DATA ? 'Un kit similaire existe déjà' : 'Impossible de créer votre kit'
      )
    }
  }

  const update = async (id: string, { name, list }: { name: string; list: KitItemDto }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/kit/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PUT',
        body: { name, list },
      })
      return true
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de mettre à jour votre kit')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/kit/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer votre kit')
    }
  }

  return {
    kits,
    fetchAll,
    fetchOne,
    update,
    deleteOne,
    create,
  }
})
