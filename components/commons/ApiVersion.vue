<script setup lang="ts">
import { useAppStore } from '~/store/app'
import { COOKIE } from '~/types/constants'

const appStore = useAppStore()
const cookie = useCookie(COOKIE.API_VERSION_CHECKED)

onMounted(async () => {
  if (cookie.value) return
  await appStore.fetchApiVersion()
  await appStore.fetchRepoApiVersion()
  cookie.value = true
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
