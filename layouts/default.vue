<script setup lang="ts">
import AppHeader from '~/components/commons/AppHeader.vue'
import AppFooter from '~/components/commons/AppFooter.vue'

const drawerIsOpened = ref(null)
</script>

<template>
  <div>
    <slot name="navDrawer" />
    <AppHeader v-model="drawerIsOpened" />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <AppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
