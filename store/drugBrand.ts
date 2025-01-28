import { ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import DrugBrandDto from '~/dto/DrugBrandDto'

export const useDrugBrandStore = defineStore('drugBrandStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const drugBrands = ref<DrugBrandDto[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/api/v1/drug-brand', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      drugBrands.value = res.map((drugBrand: unknown) => plainToInstance(DrugBrandDto, drugBrand))
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer les marques de médicaments')
    }
  }

  const create = async (name: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      drugBrands.value.push(
        plainToInstance(
          DrugBrandDto,
          await $apiFetch('/api/v1/drug-brand', {
            headers: { Authorization: `Bearer ${authStore.token}` },
            method: 'POST',
            body: { name },
          })
        )
      )
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de créer la marque de médicament')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/api/v1/drug-brand/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer la marque de médicament')
    }
  }

  return {
    drugBrands,
    fetchAll,
    create,
    deleteOne,
  }
})
