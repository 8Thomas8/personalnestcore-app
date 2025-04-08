<script setup lang="ts">
import { useAppStore } from '~/store/app'
import { COOKIE } from '~/types/constants'

const appStore = useAppStore()
const cookie = useCookie(COOKIE.APP_VERSION_CHECKED)

onMounted(async () => {
  if (cookie.value) return
  await appStore.fetchAppVersion()
  await appStore.fetchRepoAppVersion()
  cookie.value = true
})
</script>

<template>
  <span>
    App:
    <span class="font-weight-bold"
      >{{ !appStore.appVersion || !appStore.appVersion.length ? '?' : appStore.appVersion }}
    </span>
  </span>
</template>
