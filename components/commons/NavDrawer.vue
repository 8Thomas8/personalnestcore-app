<script setup lang="ts">
import { servicesMenu } from '~/types/servicesMenu'
import { useCustomRecordStore } from '~/store/customRecord'
import { slugify } from '~/utils/text'
import { useDisplay } from 'vuetify'

const customRecordStore = useCustomRecordStore()
const { lgAndUp } = useDisplay()

const drawerIsOpened = defineModel<boolean | null>({ default: false })
const addOrUpdateCustomRecordDialogIsOpened = defineModel('addOrUpdateCustomRecordDialogIsOpened', {
  default: false,
  type: Boolean,
})

watch(lgAndUp, () => {
  if (!lgAndUp.value) return

  drawerIsOpened.value = true
})

useAsyncData(async () => {
  await customRecordStore.fetchAll()
})

const updateAddOrUpdateCustomRecordDialogIsOpened = (value: boolean) => {
  addOrUpdateCustomRecordDialogIsOpened.value = value
}

const onClick = () => {
  if (lgAndUp.value) return
  drawerIsOpened.value = !drawerIsOpened.value
}
</script>

<template>
  <v-navigation-drawer v-model="drawerIsOpened">
    <v-list class="d-flex align-center">
      <v-list-item title="Mes Services" />
      <v-spacer />
      <v-icon v-if="!lgAndUp" size="24" class="pr-4" @click="drawerIsOpened = !drawerIsOpened">mdi-close</v-icon>
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
        @click="onClick" />
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
        v-for="tracking in customRecordStore.customRecords.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )"
        prepend-icon="mdi-poll"
        :key="tracking.name"
        :to="`suivi-${tracking.id}-${slugify(tracking.name)}`"
        variant="flat"
        :title="tracking.name"
        @click="onClick" />
    </v-list>

    <AddOrUpdateCustomRecord
      v-model="addOrUpdateCustomRecordDialogIsOpened"
      @update:add-or-update-custom-record-dialog-is-opened="updateAddOrUpdateCustomRecordDialogIsOpened"
      :is-update-mode="false" />
  </v-navigation-drawer>
</template>
