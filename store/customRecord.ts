import { ApiError, CustomRecordView, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import CustomRecordDto from '~/dto/CustomRecordDto'

export const useCustomRecordStore = defineStore('customRecordStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const customRecords = ref<CustomRecordDto[]>([])
  const customRecord = ref<CustomRecordDto | null>(null)

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/custom-record', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
      customRecords.value = res.map((customRecord: unknown) => plainToInstance(CustomRecordDto, customRecord))
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos autres suivis')
    }
  }

  const fetchOne = async (id: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch(`/v1/custom-record/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
      customRecord.value = plainToInstance(CustomRecordDto, res)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer votre suivi')
    }
  }

  const create = async ({ name, view }: { name: string; view: null | CustomRecordView }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/v1/custom-record', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { name, view },
      })
      return true
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        e.message === ApiError.API_ERROR_SIMILAR_DATA
          ? 'Un suivi similaire existe déjà'
          : 'Impossible de créer votre suivi'
      )
    }
  }

  const update = async (id: string, { name, view }: { name: string; view: CustomRecordView | null }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/custom-record/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PUT',
        body: { name, view },
      })
      return true
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de mettre à jour votre suivi')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/custom-record/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer votre suivi')
    }
  }

  return {
    customRecords,
    customRecord,
    fetchAll,
    fetchOne,
    update,
    deleteOne,
    create,
  }
})
