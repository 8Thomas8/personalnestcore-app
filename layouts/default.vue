<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'
import { ServiceRoutes } from '~/types/routes'

const authStore = useAuthStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await router.replace(ServiceRoutes.Drugs)
    }
  }
)

onBeforeMount(async () => {
  await authStore.fetchUser()
})
</script>

<template>
  <div>
    <CommonsAppHeader />

    <v-main>
      <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
