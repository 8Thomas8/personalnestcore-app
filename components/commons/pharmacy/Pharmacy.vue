<script setup lang="ts">
import { DrugFormTranslations, DrugUnitTranslations, ItemPerPage } from '~/types/constants'
import { useUserDrugStore } from '~/store/userDrug'
import type UserDrugDto from '~/dto/UserDrugDto'
import { useDisplay } from 'vuetify'

const addOrUpdateDrugDialogIsOpened = defineModel({ default: false, type: Boolean })

const userDrugStore = useUserDrugStore()
const { smAndUp } = useDisplay()

const DebounceDelay = 300

const expiredOnly = ref(false)
const expiringSoon = ref(false)
const searchTerms = ref('')
const isLoading = ref(false)
const itemPerPage = ref(ItemPerPage)
const currentPage = ref(1)
const itemToDelete = ref<UserDrugDto | null>(null)
const confirmationDialogIsOpened = ref(false)
const updateMode = ref(false)
const itemToUpdate = ref<UserDrugDto | null>(null)
const quantityChange = ref(0)

const headers = [
  { title: 'Nom', key: 'drugName.name' },
  {
    title: "Date d'expiration",
    key: 'expirationDateTime',
    align: 'center',
  },
  { title: 'Marque', key: 'drugBrand.name', align: 'center d-none d-sm-table-cell' },
  {
    title: 'Dose',
    key: 'dose',
  },
  {
    title: 'Forme',
    value: (item: UserDrugDto) => DrugFormTranslations[item.form],
    key: 'form',
    align: 'center d-none d-sm-table-cell',
  },
  {
    title: 'Conteneur',
    key: 'drugContainer.name',
    align: 'center',
  },
  { title: 'Actions', key: 'actions', align: 'end' },
]
useAsyncData(async () => {
  isLoading.value = true
  await userDrugStore.fetchAll(
    currentPage.value,
    itemPerPage.value,

    searchTerms.value,
    expiredOnly.value,
    expiringSoon.value
  )
  isLoading.value = false
})

watchDebounced(
  [currentPage, itemPerPage, searchTerms, expiredOnly, expiringSoon],
  async () => {
    isLoading.value = true
    await userDrugStore.fetchAll(
      currentPage.value,
      itemPerPage.value,
      searchTerms.value,
      expiredOnly.value,
      expiringSoon.value
    )
    isLoading.value = false
  },
  { debounce: DebounceDelay }
)

const updateAddOrUpdateDrugDialogIsOpened = (value: boolean) => {
  addOrUpdateDrugDialogIsOpened.value = value
}

const handleCheckboxChange = (checkbox: 'expiredOnly' | 'expiringSoon') => {
  if (checkbox === 'expiredOnly') {
    if (expiredOnly.value) expiringSoon.value = false
  } else {
    if (expiringSoon.value) expiredOnly.value = false
  }
}

const onClickDelete = (item: UserDrugDto) => {
  itemToDelete.value = item
  confirmationDialogIsOpened.value = true
}

const onDeleteConfirmation = async () => {
  if (itemToDelete.value) {
    isLoading.value = true
    await userDrugStore.deleteOne(itemToDelete.value.id)
    itemToDelete.value = null
    await userDrugStore.fetchAll(
      currentPage.value,
      itemPerPage.value,
      searchTerms.value,
      expiredOnly.value,
      expiringSoon.value
    )
    isLoading.value = false
    confirmationDialogIsOpened.value = false
  }
}

const onCancelDelete = () => {
  itemToDelete.value = null
  confirmationDialogIsOpened.value = false
}

const onClickUpdate = (item: UserDrugDto) => {
  updateMode.value = true
  itemToUpdate.value = item
  addOrUpdateDrugDialogIsOpened.value = true
}

const onAddDrug = () => {
  itemToUpdate.value = null
  updateMode.value = false
  addOrUpdateDrugDialogIsOpened.value = true
}

const addQuantityWithDebounce = useDebounceFn(async (item: UserDrugDto) => {
  const { id } = item

  await userDrugStore.updateQuantity(id, item.quantity + quantityChange.value)

  quantityChange.value = 0

  await userDrugStore.fetchAll(
    currentPage.value,
    itemPerPage.value,
    searchTerms.value,
    expiredOnly.value,
    expiringSoon.value
  )
}, DebounceDelay)

const removeQuantityWithDebounce = useDebounceFn(async (item: UserDrugDto) => {
  const { id } = item

  await userDrugStore.updateQuantity(id, item.quantity - quantityChange.value)

  quantityChange.value = 0

  await userDrugStore.fetchAll(
    currentPage.value,
    itemPerPage.value,
    searchTerms.value,
    expiredOnly.value,
    expiringSoon.value
  )
}, DebounceDelay)

const onAddQuantity = (item: UserDrugDto) => {
  quantityChange.value += 1
  addQuantityWithDebounce(item)
}

const onRemoveQuantity = (item: UserDrugDto) => {
  quantityChange.value += 1
  removeQuantityWithDebounce(item)
}
</script>

<template>
  <div>
    <v-card class="pa-2 pa-sm-4">
      <v-row>
        <v-col cols="auto" class="d-flex">
          <div class="d-flex align-center">
            <v-icon icon="mdi-calendar-remove" color="error" />
            <v-checkbox
              hide-details
              color="primary"
              v-model="expiredOnly"
              @change="handleCheckboxChange('expiredOnly')" />
          </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-calendar-clock" color="warning" />
            <v-checkbox
              hide-details
              color="primary"
              v-model="expiringSoon"
              @change="handleCheckboxChange('expiringSoon')" />
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="auto" class="d-flex align-center">
          <v-btn @click="onAddDrug()">
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
            :items-length="userDrugStore.userDrugsMeta.total"
            :loading="isLoading"
            :mobile="false"
            :headers="headers"
            :hide-default-header="!smAndUp"
            :items="userDrugStore.userDrugs.sort((a, b) => a.drugName.name.localeCompare(b.drugName.name))">
            <template #top>
              <v-text-field hide-details v-model="searchTerms" label="Recherche *" clearable />
            </template>
            <template #[`item.drugName.name`]="{ item }">
              <div class="d-flex align-center ga-1">
                <div class="d-flex justify-end align-center ga-2 py-1 py-xs-0">
                  <div class="d-none d-sm-flex flex-column justify-end ga-2 align-center">
                    <v-btn border size="24" variant="elevated" color="green" @click="onAddQuantity(item)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn size="24" variant="elevated" color="red" @click="onRemoveQuantity(item)">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </div>
                  <pre class="bg-white border rounded text-body-2 text-sm-body-1 pa-1">{{ item.quantity }}</pre>
                </div>

                <v-tooltip open-on-hover open-on-click open-on-focus location="top" :text="item.drugName.name">
                  <template v-slot:activator="{ props }">
                    <p v-bind="props" class="text-truncate truncate-width font-weight-bold">
                      {{ item.drugName.name }}
                    </p>
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template #[`item.drugBrand.name`]="{ item }">
              <div class="d-flex justify-end">
                <v-tooltip open-on-hover open-on-click open-on-focus location="top" :text="item.drugBrand.name">
                  <template v-slot:activator="{ props }">
                    <p v-bind="props" class="text-truncate truncate-width">
                      {{ item.drugBrand.name }}
                    </p>
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template #[`item.dose`]="{ item }">
              <p class="text-center dose-with">
                {{ `${item.dose || ''} ${DrugUnitTranslations[item.unit] || ''}` }}
              </p>
            </template>
            <template #[`item.expirationDateTime`]="{ item }">
              <v-tooltip open-on-hover open-on-click open-on-focus location="top" :text="item.expirationDateTime">
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    :color="item.isExpired ? 'error' : item.isExpireSoon ? 'warning' : 'green-lighten-1'">
                    <v-icon
                      :icon="
                        item.isExpired
                          ? 'mdi-calendar-remove'
                          : item.isExpireSoon
                            ? 'mdi-calendar-clock'
                            : 'mdi-calendar'
                      " />
                  </v-chip>
                </template>
              </v-tooltip>
            </template>
            <template #[`item.drugContainer.name`]="{ item }">
              <v-tooltip
                open-on-hover
                open-on-click
                open-on-focus
                location="top"
                :text="item.drugContainer.name ?? 'N/A'">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props">
                    <span class="text-truncate truncate-width">{{ item.drugContainer.name ?? 'N/A' }}</span>
                  </v-chip>
                </template>
              </v-tooltip>
            </template>
            <template #[`item.actions`]="{ item }">
              <div class="d-flex ga-2 py-2 py-xs-0 justify-end">
                <v-tooltip left open-on-hover open-on-click open-on-focus :text="item.note">
                  <template #activator="{ props }">
                    <v-btn
                      :disabled="!item.note"
                      v-bind="props"
                      variant="elevated"
                      :color="item.note ? 'primary' : 'grey'"
                      :min-width="smAndUp ? '46px' : '32px'"
                      class="px-0">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-btn
                  variant="elevated"
                  color="info"
                  @click="onClickUpdate(item)"
                  :min-width="smAndUp ? '46px' : '32px'"
                  class="px-0">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  variant="elevated"
                  color="red"
                  @click="onClickDelete(item)"
                  :min-width="smAndUp ? '46px' : '32px'"
                  class="px-0">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-card>

    <AddOrUpdateDrugDialog
      v-model="addOrUpdateDrugDialogIsOpened"
      :current-page="currentPage"
      :item-per-page="itemPerPage"
      :expired-only="expiredOnly"
      :expiring-soon="expiringSoon"
      :search-terms="searchTerms"
      :update-mode="updateMode"
      :item-to-update="itemToUpdate"
      @update:add-or-update-drug-dialog-is-opened="updateAddOrUpdateDrugDialogIsOpened" />

    <ConfirmationDialog
      v-model="confirmationDialogIsOpened"
      text="Voulez-vous supprimer ce médicament ?"
      :is-loading="isLoading"
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </div>
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
    width: 150px;
  }
  .dose-with {
    width: max-content;
  }
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  :deep(.v-data-table__tr) {
    font-size: 12px;

    .truncate-width {
      width: 90px;
    }
  }

  :deep(.v-data-table__td) {
    padding: 0 4px !important;
  }
}
</style>
