<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { useAuthStore } from '~/store/auth'
import type { AccountRoutes, ServiceRoutes } from '~/types/routes'
import { PublicRoutes } from '~/types/routes'

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { toggleAuthDialog } = useAuth()

onBeforeMount(async () => {
  await userStore.fetchUser()
  if (!authStore.isAuthenticated) {
    await router.replace(PublicRoutes.Home)
    if (route.query['from'] !== PublicRoutes.Home) {
      toggleAuthDialog(true)
    }
  } else {
    await router.replace(route.query['from'] as AccountRoutes | ServiceRoutes)
  }
})
</script>

<template>
  <h1>Connexion en cours ...</h1>
</template>
