<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'
import { ServiceRoutes } from '~/types/routes'

const authStore = useAuthStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await router.replace(ServiceRoutes.Pharmacy)
    }
  }
)

onBeforeMount(async () => {
  await authStore.fetchUser()
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <CommonsAppHeader />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
