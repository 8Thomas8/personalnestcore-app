<script setup lang="ts">
import { useAppStore } from '~/store/app'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.fetchAppVersion()
  await appStore.fetchRepoAppVersion()
})
</script>

<template>
  <span>
    | App:
    <span class="font-weight-bold"
      >{{ !appStore.appVersion || !appStore.appVersion.length ? '?' : appStore.appVersion }}
    </span>
  </span>
</template>
