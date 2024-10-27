<script setup lang="ts">
const drawerIsOpened = ref(null)
</script>

<template>
  <div>
    <CommonsNavDrawer v-model="drawerIsOpened" />
    <CommonsAppHeader v-model="drawerIsOpened" show-toggle-drawer />

    <v-main>
      <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
