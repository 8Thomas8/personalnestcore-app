<script lang="ts" setup>
import { useAppStore } from '~/store/app'
import { compareSemVer, filterStableVersions } from '~/utils/version'
import { ToastMessageType } from '~/types/constants'
import 'reflect-metadata'

const appStore = useAppStore()
const { setToastMessage } = useToastMessage()
const config = useRuntimeConfig()

watch(
  [() => appStore.appVersion, () => appStore.repoAppVersions],
  ([toAppVersion, toRepoAppVersions]: [string, string[]]) => {
    const availableAppVersions = config.public.notify.devVersion
      ? toRepoAppVersions
      : filterStableVersions(toRepoAppVersions)

    if (toAppVersion && availableAppVersions.length) {
      try {
        if (
          toAppVersion !== availableAppVersions.sort((a, b) => compareSemVer(a, b))[availableAppVersions.length - 1]
        ) {
          setToastMessage(ToastMessageType.TypeInfo, "Une nouvelle version de l'application est disponible.")
        }
      } catch (error) {
        setToastMessage(ToastMessageType.TypeError, error.message)
      }
    }
  }
)

watch(
  [() => appStore.apiVersion, () => appStore.repoApiVersions],
  ([toApiVersion, toRepoApiVersions]: [string, string[]]) => {
    const availableApiVersions = config.public.notify.devVersion
      ? toRepoApiVersions
      : filterStableVersions(toRepoApiVersions)

    if (toApiVersion && availableApiVersions.length) {
      try {
        if (
          toApiVersion !== availableApiVersions.sort((a, b) => compareSemVer(a, b))[availableApiVersions.length - 1]
        ) {
          setToastMessage(ToastMessageType.TypeInfo, "Une nouvelle version de l'api est disponible.")
        }
      } catch (error) {
        setToastMessage(ToastMessageType.TypeError, error.message)
      }
    }
  }
)
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
