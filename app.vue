<script setup lang="ts">
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

onBeforeMount(() => userStore.fetchUser())
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
