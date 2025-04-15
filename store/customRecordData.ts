import { ApiError, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import CustomRecordDataDto from '~/dto/CustomRecordDataDto'
import ApiMetaDto from '~/dto/ApiMetaDto'

export const useCustomRecordDataStore = defineStore('customRecordDataStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const customRecordData = ref<CustomRecordDataDto[]>([])
  const customRecordDataMeta = ref<ApiMetaDto>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
    firstPage: 0,
  })

  // Actions
  const fetchAll = async (
    customRecordId: number,
    startDate: string,
    endDate: string,
    currentPage: number,
    itemPerPage: number
  ) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch(`/v1/custom-record/${customRecordId}/data`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: { currentPage, itemPerPage, startDate, endDate },
        method: 'GET',
      })
      customRecordData.value = res.data.map((data: unknown) => plainToInstance(CustomRecordDataDto, data))
      customRecordDataMeta.value = plainToInstance(ApiMetaDto, res.meta)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos données de suivi')
    }
  }

  const create = async (customRecordId: number, { content, datetime }: { content: string; datetime: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/custom-record/${customRecordId}/data`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { content, datetime },
      })
      return true
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        e.message === ApiError.API_ERROR_SIMILAR_DATA
          ? 'Une donnée similaire existe déjà'
          : 'Impossible de créer votre donnée de suivi'
      )
    }

    return false
  }

  const deleteOne = async ({
    customRecordId,
    customRecordDataId,
  }: {
    customRecordId: number
    customRecordDataId: number
  }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/custom-record/${customRecordId}/data/${customRecordDataId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer votre donnée de suivi')
    }
  }

  return {
    customRecordData,
    customRecordDataMeta,
    fetchAll,
    deleteOne,
    create,
  }
})
