import { ToastMessageType } from '~/types/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import DrugContainerDto from '~/dto/DrugContainerDto'

export const useDrugContainerStore = defineStore('drugContainerStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const drugContainers = ref<DrugContainerDto[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/v1/drug-container', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      drugContainers.value = res.map((drugContainer: unknown) => plainToInstance(DrugContainerDto, drugContainer))
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer les conteneurs')
    }
  }

  const create = async (name: string) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      drugContainers.value.push(
        plainToInstance(
          DrugContainerDto,
          await $apiFetch('/v1/drug-container', {
            headers: { Authorization: `Bearer ${authStore.token}` },
            method: 'POST',
            body: { name },
          })
        )
      )
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de créer le conteneur')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/v1/drug-container/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de supprimer le conteneur')
    }
  }

  return {
    drugContainers,
    fetchAll,
    create,
    deleteOne,
  }
})
