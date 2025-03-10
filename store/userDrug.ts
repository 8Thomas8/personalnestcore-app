import type { DrugForm, DrugUnit } from '~/types/constants'
import { ApiError, ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import UserDrugDto from '~/dto/UserDrugDto'
import ApiMetaDto from '~/dto/ApiMetaDto'

export const useUserDrugStore = defineStore('userDrugStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const userDrugs = ref<UserDrugDto[]>([])
  const userDrugsMeta = ref<ApiMetaDto>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
    firstPage: 0,
  })

  // Actions
  const fetchAll = async (
    currentPage: number,
    itemPerPage: number,
    terms: string,
    expiredOnly: boolean,
    expireSoon: boolean
  ) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/user-drug', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        params: { currentPage, itemPerPage, terms, expiredOnly, expireSoon },
        method: 'GET',
      })

      userDrugs.value = res.data.map((userDrug: unknown) => plainToInstance(UserDrugDto, userDrug))
      userDrugsMeta.value = plainToInstance(ApiMetaDto, res.meta)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos médicaments')
    }
  }

  const create = async ({
    drugBrandId,
    drugNameId,
    drugContainerId,
    form,
    dose,
    note,
    unit,
    expirationDateTime,
    quantity,
  }: {
    drugBrandId: number | null
    drugNameId: number | null
    drugContainerId: number | null
    form: DrugForm | null
    dose: string | null
    note: string | null
    unit: DrugUnit | null
    expirationDateTime: string | undefined
    quantity: string | null
  }) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/v1/user-drug', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: {
          drugBrandId,
          drugNameId,
          drugContainerId,
          form,
          dose,
          note,
          unit,
          expirationDateTime,
          quantity,
        },
      })
      return true
    } catch (e) {
      setToastMessage(
        ToastMessageType.TypeError,
        e.message === ApiError.API_ERROR_SIMILAR_DATA
          ? 'Un médicament similaire existe déjà'
          : 'Impossible de créer votre médicament'
      )
    }

    return false
  }

  const update = async (
    id: number,
    data: {
      drugBrandId: number | null
      drugNameId: number | null
      drugContainerId: number | null
      form: DrugForm | null
      dose: string | null
      note: string | null
      unit: DrugUnit | null
      expirationDateTime: string | undefined
      quantity: string | null
    }
  ) => {
    authStore.getToken()

    if (!authStore.token) return

    const { drugBrandId, drugNameId, drugContainerId, form, dose, note, unit, expirationDateTime, quantity } = data

    try {
      await $apiFetch(`/v1/user-drug/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PUT',
        body: {
          drugBrandId,
          drugNameId,
          drugContainerId,
          form,
          dose,
          note,
          unit,
          expirationDateTime,
          quantity,
        },
      })
      return true
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de mettre à jour votre médicament')
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/user-drug/${id}/quantity`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'PATCH',
        body: { quantity },
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de mettre à jour la quantité de votre médicament')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/user-drug/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Suppression impossible')
    }
  }

  return {
    userDrugs,
    userDrugsMeta,
    fetchAll,
    create,
    update,
    updateQuantity,
    deleteOne,
  }
})
