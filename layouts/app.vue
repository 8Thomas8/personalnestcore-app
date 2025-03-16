<script setup lang="ts">
const drawerIsOpened = ref(null)
</script>

<template>
  <div class="h-100 d-flex flex-column bg-grey-lighten-5">
    <CommonsNavDrawer v-model="drawerIsOpened" />
    <CommonsHeader v-model="drawerIsOpened" nav-drawer-is-active />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <CommonsFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
