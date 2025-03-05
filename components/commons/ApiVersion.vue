<script setup lang="ts">
import { useAppStore } from '~/store/app'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.fetchApiVersion()
  await appStore.fetchRepoApiVersion()
})
</script>

<template>
  <span>
    Api:
    <span class="font-weight-bold"
      >{{ !appStore.apiVersion || !appStore.apiVersion.length ? '?' : appStore.apiVersion }}
    </span>
  </span>
</template>
