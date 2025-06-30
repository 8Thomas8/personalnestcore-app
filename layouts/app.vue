<script setup lang="ts">
import { useDisplay } from 'vuetify/framework'

const { mdAndDown } = useDisplay()

const drawerIsOpened = ref(false)

watch(mdAndDown, (isMobile) => {
  drawerIsOpened.value = !isMobile
})
</script>

<template>
  <div class="h-100 d-flex flex-column bg-grey-lighten-5">
    <NavDrawer v-model:is-opened="drawerIsOpened" />
    <Header v-model:is-opened="drawerIsOpened" nav-drawer-is-active />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <Footer />

    <AuthDialog />
    <ToastMessage />
  </div>
</template>
