import { ApiError, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import ApiMetaDto from '~/dto/ApiMetaDto'
import WaterConsumptionRecordDto from '~/dto/WaterConsumptionRecordDto'
import { dateToString } from '~/utils/date'

export const useWaterConsumptionRecordStore = defineStore('waterConsumptionRecordStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const waterConsumptionRecords = ref<WaterConsumptionRecordDto[]>([])
  const waterConsumptionRecordsMeta = ref<ApiMetaDto>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
    firstPage: 0,
  })
  const waterConsumptionAverageInCurrentYear = ref(0)
  const waterConsumptionAverageInPeriod = ref(0)

  // Actions
  const fetchAll = async ({
    startDate,
    endDate,
    currentPage,
    itemPerPage,
  }: {
    startDate: string
    endDate: string
    currentPage: number
    itemPerPage: number
  }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch(`/v1/water-consumption-record`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: { currentPage, itemPerPage, startDate, endDate },
        method: 'GET',
      })
      waterConsumptionRecords.value = res.data.map((data: unknown) => plainToInstance(WaterConsumptionRecordDto, data))
      waterConsumptionRecordsMeta.value = plainToInstance(ApiMetaDto, res.meta)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos données de consommation')
    }
  }

  const create = async ({ index, date, comment }: { index: number; date: string; comment: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/water-consumption-record`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { index, date, comment },
      })
      return true
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        e.message === ApiError.API_ERROR_SIMILAR_DATA
          ? 'Une donnée similaire existe déjà'
          : 'Impossible de créer votre donnée de consommation'
      )
    }

    return false
  }

  const update = async (id: number, { index, date, comment }: { index: number; date: string; note: string }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/water-consumption-record/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PUT',
        body: { index, date, comment },
      })
      return true
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de mettre à jour la donnée')
    }
  }

  const deleteOne = async (waterConsumptionRecord: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/water-consumption-record/${waterConsumptionRecord}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer votre donnée de consommation')
    }
  }

  const fetchWaterConsumptionAverageInRange = async ({
    startDate,
    endDate,
  }: {
    startDate: string
    endDate: string
  }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const { average } = await $apiFetch(`/v1/water-consumption-record/average`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: { startDate, endDate },
        method: 'GET',
      })
      waterConsumptionAverageInPeriod.value = average
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer la moyenne de consommation')
    }
  }

  const fetchWaterConsumptionAverageInCurrentYear = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const yearStartDate = dateToString(new Date(new Date().getFullYear(), 0, 1))
      const { average } = await $apiFetch(`/v1/water-consumption-record/average`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: { startDate: yearStartDate, endDate: dateToString(new Date()) },
        method: 'GET',
      })
      waterConsumptionAverageInCurrentYear.value = average
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer la moyenne de consommation')
    }
  }

  return {
    waterConsumptionRecords,
    waterConsumptionRecordsMeta,
    waterConsumptionAverageInPeriod,
    waterConsumptionAverageInCurrentYear,
    fetchAll,
    deleteOne,
    create,
    update,
    fetchWaterConsumptionAverageInRange,
    fetchWaterConsumptionAverageInCurrentYear,
  }
})
