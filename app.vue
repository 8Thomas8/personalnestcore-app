<script lang="ts" setup>
import { useAppStore } from '~/store/app'
import { compareSemVer, filterStableVersions } from '~/utils/version'
import { ToastMessageType } from '~/types/constants'

const appStore = useAppStore()
const { setToastMessage } = useToastMessage()
const config = useRuntimeConfig()

watch([() => appStore.appVersion, () => appStore.repoAppVersions], ([toAppVersion, toRepoAppVersions]: string[]) => {
  if (toAppVersion && toRepoAppVersions.length) {
    const availableVersions = config.public.notify.devVersion
      ? toRepoAppVersions
      : filterStableVersions(toRepoAppVersions)
    try {
      if (toAppVersion !== availableVersions.sort((a, b) => compareSemVer(a, b))[availableVersions.length - 1]) {
        setToastMessage(ToastMessageType.TypeInfo, "Une nouvelle version de l'application est disponible.")
      }
    } catch (error) {
      setToastMessage(ToastMessageType.TypeError, error.message)
    }
  }
})
</script>

<template>
  <Head>
    <title>PersonalNestCore</title>
  </Head>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
