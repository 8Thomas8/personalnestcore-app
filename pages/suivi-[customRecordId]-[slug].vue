<script lang="ts" setup>
import { useCustomRecordStore } from '~/store/customRecord'
import { ItemPerPage } from '~/types/constants'
import CustomRecordDto from '~/dto/CustomRecordDto'
import CustomRecordDataDto from '~/dto/CustomRecordDataDto'
import { ServiceRoutes } from '~/types/routes'
import { useDisplay } from 'vuetify'
import { useCustomRecordDataStore } from '~/store/customRecordData'

definePageMeta({ layout: 'app' })

const customRecordStore = useCustomRecordStore()

useHead({ title: `${customRecordStore.customRecord?.name ?? 'Suivi'}` })

const addOrUpdateCustomRecordDialogIsOpened = ref(false)
const addCustomRecordDataDialogIsOpened = ref(false)

const route = useRoute()
const router = useRouter()
const { smAndUp } = useDisplay()
const customRecordDataStore = useCustomRecordDataStore()
const { firstDateIsBeforeSecondDate } = useFormValidation()

const isLoading = ref(false)
const isLoadingData = ref(false)
const isDeleteLoading = ref(false)
const itemToDelete = ref<{ isData: boolean; item: CustomRecordDto | CustomRecordDataDto | null }>()
const startDate = ref<string>()
const endDate = ref<string>()
const itemPerPage = ref(ItemPerPage)
const currentPage = ref(1)
const deleteConfirmationMessage = ref<string>('')
const confirmationDialogIsOpened = ref(false)
const headers = [
  { title: 'Date', key: 'datetime', align: 'start', customKeySort: 'datetime' },
  { title: 'Donnée', key: 'content', align: 'start' },
  { title: 'Actions', key: 'actions', align: 'end' },
]

watch([startDate, endDate], async () => await fetchCustomRecordData())

onBeforeMount(async () => {
  isLoading.value = true
  await customRecordStore.fetchOne(route.params.customRecordId)
  await fetchCustomRecordData()
  isLoading.value = false
})

const setDefaultDates = () => {
  const currentDate = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(currentDate.getMonth() - 1)

  startDate.value = oneMonthAgo
  endDate.value = currentDate
}

setDefaultDates()

const onDeleteCustomRecord = () => {
  itemToDelete.value = { isData: false, item: customRecordStore.customRecord }
  deleteConfirmationMessage.value = 'Voulez-vous supprimer ce suivi ?'
  confirmationDialogIsOpened.value = true
}

const onDeleteConfirmation = async () => {
  if (!itemToDelete.value?.item) return

  isDeleteLoading.value = true

  if (!itemToDelete.value?.isData) {
    await customRecordStore.deleteOne(itemToDelete.value.item.id)
    await customRecordStore.fetchAll()
    await router.replace(ServiceRoutes.Pharmacy)
  } else {
    await customRecordDataStore.deleteOne({
      customRecordId: itemToDelete.value.item.id,
      customRecordDataId: itemToDelete.value.item.id,
    })
    await fetchCustomRecordData()
  }

  confirmationDialogIsOpened.value = false
  itemToDelete.value = null
  isDeleteLoading.value = false
}

const onCancelDelete = () => {
  itemToDelete.value = null
  confirmationDialogIsOpened.value = false
}

const fetchCustomRecordData = async () => {
  isLoadingData.value = true

  const currentDate = new Date()
  const firstDate = startDate.value ? new Date(startDate.value) : currentDate
  if (!startDate.value) {
    firstDate.setMonth(currentDate.getMonth() - 1)
  }

  await customRecordDataStore.fetchAll(
    route.params.customRecordId,
    dateToString(firstDate),
    dateToString(new Date(endDate.value ?? Date.now())),
    currentPage.value,
    itemPerPage.value
  )
  isLoadingData.value = false
}

const onClickDeleteData = (data: CustomRecordDataDto) => {
  itemToDelete.value = { isData: true, item: data }
  deleteConfirmationMessage.value = 'Voulez-vous supprimer cet enregistrement ?'
  confirmationDialogIsOpened.value = true
}
</script>

<template>
  <v-container max-width="1144">
    <v-card class="pa-2 pa-sm-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-poll" class="mr-2" />
        <div v-if="!isLoading" class="d-flex text-wrap justify-space-between align-center ga-2">
          {{ customRecordStore.customRecord.name }}
          <span class="d-flex ga-2 align-center">
            <v-icon
              size="24"
              icon="mdi-note-edit"
              color="warning"
              @click="addOrUpdateCustomRecordDialogIsOpened = true" />
            <v-icon size="24" icon="mdi-delete" color="red" @click="onDeleteCustomRecord" />
          </span>
        </div>
        <v-skeleton-loader width="200px" type="text" v-else />
      </v-card-title>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-locale-provider locale="fr">
            <v-date-input
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
          <v-btn class="ml-auto" @click="addCustomRecordDataDialogIsOpened = true">
            <v-icon icon="mdi-plus" /> <span class="ml-1 d-none d-sm-inline">Ajouter</span>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table-server
            :headers="headers"
            :loading="isLoadingData"
            v-model:items-per-page="itemPerPage"
            v-model:page="currentPage"
            loading-text="Récupération des enregistrements en cours..."
            :items="customRecordDataStore.customRecordData.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())"
            :items-length="customRecordDataStore.customRecordDataMeta.total"
            :items-per-page-options="[
              { value: 5, title: '5' },
              { value: 10, title: '10' },
              { value: 20, title: '20' },
            ]"
            no-data-text="Aucun enregistrement">
            <template #[`item.datetime`]="{ item }">
              <v-icon icon="mdi-calendar" /> {{ item.date }} - {{ item.time }}
            </template>
            <template #[`item.content`]="{ item }">
              <v-tooltip open-on-hover open-on-click open-on-focus location="top" :text="item.content">
                <template v-slot:activator="{ props }">
                  <p v-bind="props" class="text-truncate truncate-width font-weight-bold">
                    {{ item.content }}
                  </p>
                </template>
              </v-tooltip>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                variant="elevated"
                color="red"
                @click="onClickDeleteData(item)"
                :min-width="smAndUp ? '46px' : '32px'"
                class="px-0">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-card>

    <AddOrUpdateCustomRecord v-model="addOrUpdateCustomRecordDialogIsOpened" :is-update-mode="true" />
    <AddCustomRecordData
      :custom-record-id="Number(route.params.customRecordId)"
      v-model:is-opened="addCustomRecordDataDialogIsOpened" />
    <ConfirmationDialog
      v-model:is-opened="confirmationDialogIsOpened"
      :text="deleteConfirmationMessage"
      :is-loading="isDeleteLoading"
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </v-container>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as *;

:deep(.v-data-table__tr) {
  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.02);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  .truncate-width {
    width: 290px;
  }
  .dose-with {
    width: max-content;
  }
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  :deep(.v-data-table__tr) {
    font-size: 12px;

    .truncate-width {
      width: 110px;
    }
  }

  :deep(.v-data-table__td) {
    padding: 0 4px !important;
  }
}
</style>
