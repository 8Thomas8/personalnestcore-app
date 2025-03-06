import { useToastMessage } from '~/composables/useToastMessage'
import { ToastMessageType } from '~/types/constants'
import { filterInvalidVersions } from '~/utils/version'

export const useAppStore = defineStore('appStore', () => {
  const { setToastMessage } = useToastMessage()
  const config = useRuntimeConfig()
  const { $apiFetch } = useNuxtApp()

  // States
  const appVersion = ref<string | null>(null)
  const repoAppVersions = ref<string[]>([])
  const apiVersion = ref<string | null>(null)
  const repoApiVersions = ref<string[]>([])

  // Getters
  const stableRepoAppVersions = computed(() => filterStableVersions(repoAppVersions.value))
  const stableRepoApiVersions = computed(() => filterStableVersions(repoApiVersions.value))

  // Actions
  const fetchAppVersion = async () => {
    try {
      const response = await fetch(`/json/version.json?nocache=${Date.now()}`)
      const data = await response.json()

      if (!data.version?.length) {
        throw new Error()
      }
      appVersion.value = data.version
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de récupérer la version de l'application")
    }
  }

  const fetchRepoAppVersion = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.public.github.projectOwner}/${config.public.github.projectAppRepo}/releases`
      )
      const data = await response.json()
      repoAppVersions.value = filterInvalidVersions(data.map((release: { tag_name: string }) => release.tag_name))
    } catch {}
  }

  const fetchApiVersion = async () => {
    try {
      const { version } = await $apiFetch('/v1/app/version', {
        method: 'GET',
      })
      if (!version?.length) {
        throw new Error()
      }
      apiVersion.value = version
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de récupérer la version de l'api")
    }
  }

  const fetchRepoApiVersion = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.public.github.projectOwner}/${config.public.github.projectApiRepo}/releases`
      )
      const data = await response.json()
      repoApiVersions.value = filterInvalidVersions(data.map((release: { tag_name: string }) => release.tag_name))
    } catch {}
  }

  return {
    appVersion,
    apiVersion,
    repoAppVersions,
    repoApiVersions,
    stableRepoAppVersions,
    stableRepoApiVersions,
    fetchAppVersion,
    fetchApiVersion,
    fetchRepoAppVersion,
    fetchRepoApiVersion,
  }
})
