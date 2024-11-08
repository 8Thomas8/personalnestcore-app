<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

onBeforeMount(async () => {
  await userStore.fetchUser()
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
