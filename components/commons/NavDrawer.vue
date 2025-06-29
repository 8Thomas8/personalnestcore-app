<script setup lang="ts">
import { servicesMenu } from '~/types/servicesMenu'
import { useCustomRecordStore } from '~/store/customRecord'
import { slugify } from '~/utils/text'
import { useDisplay } from 'vuetify'

const customRecordStore = useCustomRecordStore()
const { lgAndUp } = useDisplay()

const drawerIsOpened = defineModel('', { default: false })
const addOrUpdateCustomRecordDialogIsOpened = ref(false)

watch(lgAndUp, (isLargeScreen) => isLargeScreen && (drawerIsOpened.value = true))

useAsyncData(() => customRecordStore.fetchAll())

const closeDrawerOnMobile = () => !lgAndUp.value && (drawerIsOpened.value = false)

const sortedTrackings = computed(() =>
  customRecordStore.customRecords.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
)
</script>

<template>
  <v-navigation-drawer v-model="drawerIsOpened">
    <v-list class="d-flex align-center">
      <v-list-item title="Mes Services" />
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
        @click="closeDrawerOnMobile" />
    </v-list>

    <v-divider />

    <v-list>
      <v-list-item title="Autres suivis" />
      <v-list-item>
        <v-btn variant="outlined" class="w-100" @click="addOrUpdateCustomRecordDialogIsOpened = true">
          <v-icon icon="mdi-plus" /> <span class="ml-1 d-none d-sm-inline">Ajouter</span>
        </v-btn>
      </v-list-item>
      <v-list-item
        v-for="tracking in sortedTrackings"
        prepend-icon="mdi-poll"
        :key="tracking.name"
        :to="`suivi-${tracking.id}-${slugify(tracking.name)}`"
        variant="flat"
        :title="tracking.name"
        @click="closeDrawerOnMobile" />
    </v-list>

    <AddOrUpdateCustomRecord
      :add-or-update-custom-record-dialog-is-opened="addOrUpdateCustomRecordDialogIsOpened"
      @update:add-or-update-custom-record-dialog-is-opened="addOrUpdateCustomRecordDialogIsOpened = $event"
      :is-update-mode="false" />
  </v-navigation-drawer>
</template>
