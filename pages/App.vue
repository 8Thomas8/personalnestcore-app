<script setup lang="ts">
import NavDrawer from '~/components/commons/NavDrawer.vue'

definePageMeta({ layout: false })

const drawerIsOpened = ref(null)
</script>

<template>
  <NuxtLayout name="default">
    <template #navDrawer>
      <NavDrawer v-model="drawerIsOpened" />
    </template>
    <h1>App page</h1>
  </NuxtLayout>
</template>
