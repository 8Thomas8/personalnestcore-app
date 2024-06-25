<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const { getData } = useUserStore()

onBeforeMount(async () => {
  await getData()
})
</script>

<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
