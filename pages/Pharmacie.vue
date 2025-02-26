<script setup lang="ts">
import { DrugFormTranslations, DrugUnitTranslations, ItemPerPage } from '~/types/constants'
import AddOrUpdateDrugDialog from '~/components/dialogs/AddOrUpdateDrugDialog.vue'
import { useUserDrugStore } from '~/store/userDrug'
import type UserDrugDto from '~/dto/UserDrugDto'
import { useDisplay } from 'vuetify'
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue'
import { stringToDate } from '~/utils/date'

definePageMeta({ layout: 'app' })
useHead({
  title: 'Pharmacie',
})

const userDrugStore = useUserDrugStore()
const { smAndDown } = useDisplay()

const addOrUpdateDrugDialogIsOpened = defineModel({ default: false, type: Boolean })

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
  { title: 'Nom', key: 'drugName.name', sortable: true },
  { title: 'Marque', key: 'drugBrand.name', sortable: true },
  {
    title: 'Dose',
    value: (item: UserDrugDto) => `${item.dose || ''} ${DrugUnitTranslations[item.unit] || ''}`,
    key: 'dose',
    sortable: false,
  },
  { title: 'Quantité', key: 'quantity', sortable: false, align: 'center' },

  {
    title: 'Forme',
    value: (item: UserDrugDto) => DrugFormTranslations[item.form],
    key: 'form',
    align: 'center',
  },
  {
    title: "Date d'expiration",
    key: 'expirationDateTime',
    sortable: true,
    align: 'center',
  },
  { title: 'Note', key: 'note', sortable: false, align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
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

const expirationDateTimeSort = (a: string, b: string) => {
  const dateA = stringToDate(a)
  const dateB = stringToDate(b)
  return dateA.getTime() - dateB.getTime()
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
  <v-container max-width="1144">
    <h1 class="pb-4 d-flex"><v-icon icon="mdi-medical-cotton-swab" class="mr-2" /> Gestion du stock de médicaments</h1>
    <v-card class="pa-4">
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn prepend-icon="mdi-plus" @click="onAddDrug()">Ajouter</v-btn>
        </v-col>
        <v-col cols="12" class="d-flex">
          <v-spacer />
          <v-checkbox
            hide-details
            color="primary"
            v-model="expiredOnly"
            label="Expiré"
            @change="handleCheckboxChange('expiredOnly')" />
          <v-checkbox
            hide-details
            color="primary"
            v-model="expiringSoon"
            label="Va expirer"
            @change="handleCheckboxChange('expiringSoon')" />
        </v-col>
        <v-col cols="12" class="d-flex">
          <v-text-field hide-details v-model="searchTerms" label="Recherche *" clearable />
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
            :mobile="smAndDown"
            :headers="headers"
            :items="userDrugStore.userDrugs"
            :custom-key-sort="{
              expirationDateTime: expirationDateTimeSort,
            }">
            <template #[`item.drugName.name`]="{ item }">
              <div class="d-flex justify-end">
                <v-tooltip location="top" :text="item.drugName.name">
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
                <v-tooltip location="top" :text="item.drugBrand.name">
                  <template v-slot:activator="{ props }">
                    <p v-bind="props" class="text-truncate truncate-width">
                      {{ item.drugBrand.name }}
                    </p>
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template #[`item.quantity`]="{ item }">
              <div class="d-flex justify-end align-center ga-2 py-1 py-xs-0">
                <div class="d-flex flex-column justify-end ga-1 align-center">
                  <v-btn border size="24" variant="elevated" color="success" @click="onAddQuantity(item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn size="24" variant="elevated" color="error" @click="onRemoveQuantity(item)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
                <span class="text-body-1">{{ item.quantity }}</span>
              </div>
            </template>
            <template #[`item.expirationDateTime`]="{ item }">
              <v-chip :color="item.isExpired ? 'error' : item.isExpireSoon ? 'warning' : 'green-lighten-1'"
                >{{ item.expirationDateTime }}
              </v-chip>
            </template>
            <template #[`item.note`]="{ item }">
              <v-tooltip v-if="item.note" :text="item.note">
                <template #activator="{ props }">
                  <v-icon v-bind="props" color="primary">mdi-information</v-icon>
                </template>
                <span>{{ item.note }}</span>
              </v-tooltip>
            </template>
            <template #[`item.actions`]="{ item }">
              <div class="d-flex flex-wrap ga-2 py-2 py-xs-0 justify-end">
                <v-btn variant="elevated" color="warning" @click="onClickUpdate(item)" min-width="46px" class="px-0">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn variant="elevated" color="error" @click="onClickDelete(item)" min-width="46px" class="px-0">
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
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-data-table__tr) {
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  .truncate-width {
    width: 150px;
  }
}
</style>
