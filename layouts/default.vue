<script setup lang="ts">
import AppHeader from '~/components/commons/AppHeader.vue'

const drawerIsOpened = ref(null)
</script>

<template>
  <div>
    <slot name="navDrawer" />
    <AppHeader v-model="drawerIsOpened" />

    <v-main>
      <slot />
    </v-main>

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
