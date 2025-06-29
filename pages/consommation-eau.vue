<script setup lang="ts">
import type WaterConsumptionRecordDto from '~/dto/WaterConsumptionRecordDto'
import { useWaterConsumptionRecordStore } from '~/store/waterConsumptionRecord'
import { ItemPerPage } from '~/types/constants'
import { useDisplay } from 'vuetify'
import { dateToString } from '~/utils/date'

definePageMeta({ layout: 'app' })
useHead({ title: "Consommation d'eau" })

const { firstDateIsBeforeSecondDate } = useFormValidation()

const addDialogIsOpened = ref(false)

const waterConsumptionRecordStore = useWaterConsumptionRecordStore()

const { smAndUp } = useDisplay()
const startDate = ref<string>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
const endDate = ref<string>(new Date())
const updateMode = ref(false)
const itemToUpdate = ref<WaterConsumptionRecordDto | null>(null)
const itemToDelete = ref<WaterConsumptionRecordDto | null>(null)
const isLoading = ref(false)
const isDeleteLoading = ref(false)
const confirmationDialogIsOpened = ref(false)
const itemPerPage = ref(ItemPerPage)
const currentPage = ref(1)
const deleteConfirmationMessage = ref<string>('')
const headers = [
  { title: 'Date', key: 'date', sortable: false, align: 'start' },
  { title: 'Index', key: 'index', sortable: false, align: 'start' },
  { title: 'Différence', key: 'diff', sortable: false, align: 'start' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

watch([startDate, endDate, itemPerPage, currentPage], () => {
  refresh()
  refreshAveragePeriod()
})

const { refresh } = useAsyncData(async () => {
  isLoading.value = true
  await waterConsumptionRecordStore.fetchAll({
    startDate: dateToString(startDate.value),
    endDate: dateToString(endDate.value),
    currentPage: currentPage.value,
    itemPerPage: itemPerPage.value,
  })
  isLoading.value = false
})

const { refresh: refreshAverageYear } = useAsyncData(async () => {
  await waterConsumptionRecordStore.fetchWaterConsumptionAverageInCurrentYear()
})

const { refresh: refreshAveragePeriod } = useAsyncData(async () => {
  await waterConsumptionRecordStore.fetchWaterConsumptionAverageInRange({
    startDate: dateToString(startDate.value),
    endDate: dateToString(endDate.value),
  })
})

const onAddWaterConsumptionRecord = () => {
  itemToUpdate.value = null
  updateMode.value = false
  addDialogIsOpened.value = true
}

const onDelete = (data: WaterConsumptionRecordDto) => {
  itemToDelete.value = data
  deleteConfirmationMessage.value = 'Voulez-vous supprimer cet enregistrement ?'
  confirmationDialogIsOpened.value = true
}

const onDeleteConfirmation = async () => {
  if (!itemToDelete.value) return

  isDeleteLoading.value = true

  await waterConsumptionRecordStore.deleteOne(itemToDelete.value.id)
  await refresh()
  await refreshAveragePeriod()
  await refreshAverageYear()

  confirmationDialogIsOpened.value = false
  itemToDelete.value = null
  isDeleteLoading.value = false
}

const onCancelDelete = () => {
  itemToDelete.value = null
  confirmationDialogIsOpened.value = false
}

const getDiff = (item: WaterConsumptionRecordDto) => {
  const array = waterConsumptionRecordStore.waterConsumptionRecords.sort((a, b) => b.date.getTime() - a.date.getTime())
  const index = array.findIndex(
    (record) => record.date.getTime() === item.date.getTime() && item.index === record.index
  )

  return array[index + 1] ? item.index - array[index + 1].index : 0
}
</script>

<template>
  <v-container max-width="1144">
    {{ addDialogIsOpened }}
    <v-card class="pa-2 pa-sm-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-water-pump " class="mr-2" /> Consommation d'eau
      </v-card-title>

      <v-row>
        <v-col cols="12" sm="6">
          <v-card
            width="100%"
            height="200"
            class="d-flex flex-column align-center justify-center blue-border pa-4 text-center"
            border="md"
            border-success
            color="blue-lighten-5">
            <v-icon size="64" color="blue">mdi-calculator-variant-outline </v-icon>
            <span class="font-weight-bold text-blue">Du 1er janvier au dernier relevé :</span>
            <span class="font-weight-bold text-blue"
              >{{ waterConsumptionRecordStore.waterConsumptionAverageInCurrentYear }} m3</span
            >
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card
            width="100%"
            height="200"
            class="d-flex flex-column align-center justify-center green-border pa-4 text-center"
            border="md"
            border-success
            color="green-lighten-5">
            <v-icon size="64" color="green">mdi-calculator-variant-outline </v-icon>
            <span class="font-weight-bold text-green">Moyenne mensuelle sur la période :</span>
            <span class="font-weight-bold text-green"
              >{{ waterConsumptionRecordStore.waterConsumptionAverageInPeriod }} m3</span
            >
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-locale-provider locale="fr">
            <v-date-input
              :loading="isLoading"
              v-model="startDate"
              label="Début"
              location="fr"
              first-day-of-week="1"
              :show-adjacent-months="false"
              prepend-icon="mdi-calendar"
              :rules="[firstDateIsBeforeSecondDate(startDate, endDate)]"
              placeholder="Début" />
          </v-locale-provider>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-locale-provider locale="fr">
            <v-date-input
              :loading="isLoading"
              v-model="endDate"
              label="Fin"
              location="fr"
              first-day-of-week="1"
              :show-adjacent-months="false"
              prepend-icon="mdi-calendar"
              :rules="[firstDateIsBeforeSecondDate(startDate, endDate)]"
              placeholder="Fin" />
          </v-locale-provider>
        </v-col>
        <v-spacer />
        <v-col cols="max" class="d-flex align-center">
          <v-btn class="ml-auto" @click="onAddWaterConsumptionRecord()">
            <v-icon icon="mdi-plus" /> <span class="ml-1 d-none d-sm-inline">Ajouter</span>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table-server
            v-model:items-per-page="itemPerPage"
            v-model:page="currentPage"
            :items-per-page-options="[
              { value: 5, title: '5' },
              { value: 10, title: '10' },
              { value: 20, title: '20' },
            ]"
            loading-text="Récupération des données en cours..."
            no-data-text="Aucune donnée trouvée"
            :items="
              waterConsumptionRecordStore.waterConsumptionRecords.sort((a, b) => b.date.getTime() - a.date.getTime())
            "
            :items-length="waterConsumptionRecordStore.waterConsumptionRecords.length"
            :loading="isLoading"
            :mobile="false"
            :headers="headers"
            :hide-default-header="!smAndUp">
            <template #[`item.date`]="{ item }">
              {{ dateToString(item.date) }}
            </template>
            <template #[`item.index`]="{ item }"> {{ item.index }} m3 </template>
            <template #[`item.diff`]="{ item }">
              <span
                class="font-weight-bold"
                :class="getDiff(item) > 0 ? 'text-success' : getDiff(item) < 0 ? 'text-error' : 'text-info'">
                {{ `${getDiff(item) > 0 ? '+' : getDiff(item) < 0 ? '-' : ''} ${getDiff(item)} m3` }}
              </span>
            </template>
            <template #[`item.actions`]="{ item }">
              <div class="d-flex ga-2 py-2 py-xs-0 justify-end">
                <v-tooltip left open-on-hover open-on-click open-on-focus :text="item.comment">
                  <template #activator="{ props }">
                    <v-btn
                      :disabled="!item.comment"
                      v-bind="props"
                      variant="elevated"
                      :color="item.comment ? 'primary' : 'grey'"
                      :min-width="smAndUp ? '46px' : '32px'"
                      class="px-0">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-btn
                  variant="elevated"
                  color="red"
                  :min-width="smAndUp ? '46px' : '32px'"
                  class="px-0"
                  @click="onDelete(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-card>

    <AddWaterConsumptionRecord
      :startDate="startDate"
      :endDate="endDate"
      :currentPage="currentPage"
      :itemPerPage="itemPerPage"
      v-model:is-opened="addDialogIsOpened" />

    <ConfirmationDialog
      v-model="confirmationDialogIsOpened"
      text="Voulez-vous supprimer cet enregistrement ?"
      :is-loading="isDeleteLoading"
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </v-container>
</template>

<style lang="scss" scoped>
.green-border {
  border-color: rgb(76, 175, 80) !important;
}
.blue-border {
  border-color: rgb(33, 150, 243) !important;
}
</style>
