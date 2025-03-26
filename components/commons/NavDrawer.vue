<script setup lang="ts">
import { servicesMenu } from '~/types/servicesMenu'
import { useCustomRecordStore } from '~/store/customRecord'
import { slugify } from '~/utils/text'

const customRecordStore = useCustomRecordStore()

const drawerIsOpened = defineModel<boolean | null>({ default: false })
const addOrUpdateCustomRecordDialogIsOpened = defineModel('addOrUpdateCustomRecordDialogIsOpened', {
  default: false,
  type: Boolean,
})

useAsyncData(async () => {
  await customRecordStore.fetchAll()
})

const updateAddOrUpdateCustomRecordDialogIsOpened = (value: boolean) => {
  addOrUpdateCustomRecordDialogIsOpened.value = value
}
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
    <v-divider />
    <v-list>
      <v-list-item title="Autres suivis" />
    </v-list>
    <v-divider />
    <div class="pa-4">
      <v-btn variant="outlined" class="w-100" @click="addOrUpdateCustomRecordDialogIsOpened = true">
        <v-icon icon="mdi-plus" /> <span class="ml-1 d-none d-sm-inline">Ajouter</span>
      </v-btn>
    </div>
    <v-list color="transparent">
      <v-list-item
        v-for="tracking in customRecordStore.customRecords"
        prepend-icon="mdi-record-circle-outline"
        :key="tracking.name"
        :to="`suivi-${tracking.id}-${slugify(tracking.name)}`"
        variant="flat"
        :title="tracking.name"
        @click="drawerIsOpened = !drawerIsOpened" />
    </v-list>

    <AddOrUpdateCustomRecord
      v-model="addOrUpdateCustomRecordDialogIsOpened"
      @update:add-or-update-custom-record-dialog-is-opened="updateAddOrUpdateCustomRecordDialogIsOpened"
      :is-update-mode="false" />
  </v-navigation-drawer>
</template>
