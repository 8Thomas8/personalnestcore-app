<script setup lang="ts">
import 'reflect-metadata'

const drawerIsOpened = ref(null)
</script>

<template>
  <div class="h-100 d-flex flex-column bg-grey-lighten-5">
    <NavDrawer v-model="drawerIsOpened" />
    <Header v-model="drawerIsOpened" nav-drawer-is-active />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <Footer />

    <AuthDialog />
    <ToastMessage />
  </div>
</template>
