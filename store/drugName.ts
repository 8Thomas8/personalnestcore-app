import { ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import DrugNameDto from '~/dto/DrugNameDto'

export const useDrugNameStore = defineStore('drugNameStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const drugNames = ref<DrugNameDto[]>([])

  // Actions
  const fetchAll = async (drugBrandId: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/drug-name', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
        params: { drugBrandId },
      })

      drugNames.value = res.map((drugName: unknown) => plainToInstance(DrugNameDto, drugName))
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer les noms de médicaments')
    }
  }

  const fetchOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch(`/v1/drug-name/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      return plainToInstance(DrugNameDto, res)
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer le nom de médicament')
    }
  }

  const create = async (name: string, drugBrandId: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/v1/drug-name', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { name, drugBrandId },
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Création du nom de médicament impossible')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/drug-name/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Suppression du nom de médicament impossible')
    }
  }

  return {
    drugNames,
    fetchAll,
    fetchOne,
    create,
    deleteOne,
  }
})
