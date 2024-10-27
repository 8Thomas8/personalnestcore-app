<script setup lang="ts">
const drawerIsOpened = defineModel<boolean>({ default: false })
</script>

<template>
  <v-navigation-drawer v-model="drawerIsOpened">
    <!--  -->
  </v-navigation-drawer>
</template>
