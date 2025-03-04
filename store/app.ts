import { useToastMessage } from '~/composables/useToastMessage'
import { ToastMessageType } from '~/types/constants'
import { filterInvalidVersions } from '~/utils/version'

export const useAppStore = defineStore('appStore', () => {
  const { setToastMessage } = useToastMessage()
  const config = useRuntimeConfig()

  // States
  const appVersion = ref<string | null>(null)
  const repoAppVersions = ref<string[]>([])

  // Getters
  const stableRepoAppVersions = computed(() => filterStableVersions(repoAppVersions.value))

  // Actions
  const fetchAppVersion = async () => {
    try {
      const response = await fetch('/json/version.json')
      const data = await response.json()
      appVersion.value = data.version.length ? data.version : null

      if (!data.version || !data.appVersion.length) {
        throw new Error()
      }
    } catch {
      setToastMessage(ToastMessageType.TypeError, "Impossible de récupérer la version de l'application")
    }
  }

  const fetchRepoAppVersion = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.public.github.projectOwner}/${config.public.github.projectRepo}/releases`
      )
      const data = await response.json()
      repoAppVersions.value = filterInvalidVersions(data.map((release: { tag_name: string }) => release.tag_name))
    } catch {
      setToastMessage(
        ToastMessageType.TypeError,
        "Impossible de récupérer la dernière version disponible de l'application"
      )
    }
  }

  return {
    appVersion,
    repoAppVersions,
    stableRepoAppVersions,
    fetchAppVersion,
    fetchRepoAppVersion,
  }
})
