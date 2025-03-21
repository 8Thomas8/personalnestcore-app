import { ApiError, CustomRecordView, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import CustomRecordDto from '~/dto/CustomRecord'

export const useCustomRecordStore = defineStore('customRecordStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const customRecords = ref<CustomRecordDto[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/custom-record', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })
      try {
        customRecords.value = res.map((customRecord: unknown) => plainToInstance(CustomRecordDto, customRecord))
      } catch (e) {
        console.log(e)
      }
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos autres suivis')
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

    return false
  }

  return {
    customRecords,
    fetchAll,
    create,
  }
})
