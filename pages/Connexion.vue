<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import type { AccountRoutes, ServiceRoutes } from '~/types/routes'
import { PublicRoutes } from '~/types/routes'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { toggleAuthDialog } = useAuth()

onBeforeMount(async () => {
  await authStore.fetchUser()
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
  <v-container max-width="1144">
    <h1>Connexion en cours ...</h1>
  </v-container>
</template>
