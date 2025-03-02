<script setup lang="ts">
const drawerIsOpened = ref(null)
</script>

<template>
  <div class="h-100 d-flex flex-column bg-grey-lighten-5">
    <CommonsNavDrawer v-model="drawerIsOpened" />
    <CommonsAppHeader v-model="drawerIsOpened" nav-drawer-is-active />

    <v-main class="flex-grow-1">
        <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
