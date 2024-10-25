<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'
import { useUserStore } from '~/store/user'
import { useRouter } from 'vue-router'
import { navigateTo } from '#app'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  async value => {
    if (value) {
      if (router.currentRoute.value.path === '/') {
        navigateTo('/app')
      }
      await userStore.getData()
    }
  },
  { immediate: true },
)
</script>

<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
