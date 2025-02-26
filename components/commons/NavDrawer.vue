<script setup lang="ts">
import { servicesMenu } from '~/types/servicesMenu'

const drawerIsOpened = defineModel<boolean | null>({ default: false })
</script>

<template>
  <v-navigation-drawer v-model="drawerIsOpened">
    <v-list class="d-flex align-center">
      <v-list-item title="Mes Services" />
      <v-spacer />
      <v-icon size="24" class="pr-4" @click="drawerIsOpened = !drawerIsOpened">mdi-close</v-icon>
    </v-list>
    <v-divider />
    <v-list color="transparent">
      <v-list-item
        v-for="service in servicesMenu"
        :key="service.title"
        variant="flat"
        :to="service.to"
        :prepend-icon="service.icon"
        :title="service.title"
        @click="drawerIsOpened = !drawerIsOpened" />
    </v-list>
  </v-navigation-drawer>
</template>
