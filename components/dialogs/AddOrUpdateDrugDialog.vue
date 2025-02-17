<script setup lang="ts">
import { useFormValidation } from '~/composables/formValidation'
import { useDrugBrandStore } from '~/store/drugBrand'
import { useDrugNameStore } from '~/store/drugName'
import { DrugForm, DrugFormTranslations, DrugUnit, DrugUnitTranslations, ToastMessageType } from '~/types/constants'
import { useUserDrugStore } from '~/store/userDrug'
import type UserDrugDto from '~/dto/UserDrugDto'
import { capitalize } from 'vue'
import { formatDateFr } from '~/utils/date'
import type { VAutocomplete, VDialog, VTextField } from 'vuetify/components'

const emits = defineEmits(['update:addOrUpdateDrugDialogIsOpened'])
const props = defineProps<{
  currentPage: number
  itemPerPage: number
  searchTerms: string
  expiredOnly: boolean
  expiringSoon: boolean
  updateMode: boolean
  itemToUpdate: UserDrugDto | null
}>()

const { required, requiredIf, shouldBeEmptyIf, isFloat, isDateisFormatFr, isNumber, min } = useFormValidation()
const drugBrandStore = useDrugBrandStore()
const drugNameStore = useDrugNameStore()
const userDrugStore = useUserDrugStore()
const { setToastMessage } = useToastMessage()

const addOrUpdateDrugDialogIsOpened = defineModel('addOrUpdateDrugDialogIsOpened', {
  type: Boolean,
  default: false,
})

const addOrUpdateDrugDialog = ref<VDialog>()
const drugNameField = ref<VTextField>()

const drugBrandIsLoading = ref(false)
const drugNameIsLoading = ref(false)
const userDrugIsLoading = ref(false)
const itemToUpdateIsFilled = ref(false)
const formIsValid = ref(false)
const addDrugForm = ref<HTMLFormElement | null>(null)
const searchDrugBrandInput = ref<string | undefined>(undefined)
const searchDrugNameInput = ref<string | undefined>(undefined)

const itemForm = ref<{
  drugBrandId: number | null
  drugNameId: number | null
  form: DrugForm | null
  dose: string | null
  note: string | null
  unit: DrugUnit | null
  expirationDateTime: string | undefined
  quantity: string | null
}>({
  drugBrandId: null,
  drugNameId: null,
  form: null,
  dose: null,
  note: null,
  unit: null,
  expirationDateTime: undefined,
  quantity: null,
})

const isDialogOpened: ComputedRef<boolean> = computed(() => addOrUpdateDrugDialog.value?.modelValue ?? false)

watch(
  () => itemForm.value.drugBrandId,
  () => {
    itemForm.value.drugNameId = null
    searchDrugNameInput.value = undefined
  }
)

watch(isDialogOpened, async (isOpened: boolean) => {
  if (isOpened && props.updateMode && props.itemToUpdate) {
    const { drugBrandId, form, dose, note, unit, expirationDateTime, quantity } = props.itemToUpdate
    await drugBrandStore.fetchAll()
    await drugNameStore.fetchAll(drugBrandId)

    itemForm.value.drugBrandId = drugBrandId
    itemForm.value.form = form
    itemForm.value.dose = dose.toString()
    itemForm.value.note = note
    itemForm.value.unit = unit
    itemForm.value.expirationDateTime = formatDateFr(expirationDateTime)
    itemForm.value.quantity = quantity.toString()
  }

  if (!isOpened && props.updateMode) {
    itemToUpdateIsFilled.value = false
  }
})

watch(
  () => itemForm.value.drugBrandId,
  async (drugBrandId: number | null) => {
    if (props.updateMode && props.itemToUpdate && drugBrandId && !itemToUpdateIsFilled.value) {
      const { drugNameId } = props.itemToUpdate
      itemForm.value.drugNameId = drugNameId
      itemToUpdateIsFilled.value = true
    }
  }
)

onBeforeUnmount(() => {
  resetForm()
})

const onSubmit = async () => {
  if (!formIsValid.value) return

  if (props.updateMode) {
    if (await userDrugStore.update(props.itemToUpdate!.id, itemForm.value)) {
      await userDrugStore.fetchAll(
        props.currentPage,
        props.itemPerPage,
        props.searchTerms,
        props.expiredOnly,
        props.expiringSoon
      )
      setToastMessage(ToastMessageType.TypeSuccess, 'Médicament modifié avec succès')
      closeDialog()
    }
  } else {
    if (await userDrugStore.create(itemForm.value)) {
      await userDrugStore.fetchAll(
        props.currentPage,
        props.itemPerPage,
        props.searchTerms,
        props.expiredOnly,
        props.expiringSoon
      )
      resetForm()

      setToastMessage(ToastMessageType.TypeSuccess, 'Médicament ajouté avec succès')
    }
  }
  userDrugIsLoading.value = false
}

const resetForm = () => {
  itemForm.value = {
    drugBrandId: undefined,
    drugNameId: null,
    form: null,
    dose: null,
    note: null,
    unit: null,
    expirationDateTime: undefined,
    quantity: null,
  }
  addDrugForm.value?.resetValidation()
  searchDrugBrandInput.value = undefined
  searchDrugNameInput.value = undefined
}

const drugFormItems = Object.entries(DrugForm).map(([, value]) => ({
  label: DrugFormTranslations[value],
  value,
}))

const closeDialog = () => {
  emits('update:addOrUpdateDrugDialogIsOpened', false)
  resetForm()
}

const onFocusBrandField = async () => {
  drugBrandIsLoading.value = true
  await drugBrandStore.fetchAll()
  drugBrandIsLoading.value = false
}

const onFocusNameField = async () => {
  drugNameIsLoading.value = true
  await drugNameStore.fetchAll(itemForm.value.drugBrandId!)
  drugNameIsLoading.value = false
}

const createDrugBrand = async (name: string) => {
  drugBrandIsLoading.value = true
  await drugBrandStore.create(capitalize(name))
  drugBrandIsLoading.value = false
}

const createDrugName = async (name: string) => {
  drugNameIsLoading.value = true
  await drugNameStore.create(capitalize(name), itemForm.value.drugBrandId!)
  await drugNameStore.fetchAll(itemForm.value.drugBrandId!)
  drugNameIsLoading.value = false
}

const replaceNonFloatCharacters = (value: string) => {
  return value.replace(/[^\d.]/g, '')
}

const replaceNonNumberCharacters = (value: string) => {
  return value.replace(/[^\d]/g, '')
}
</script>

<template>
  <v-dialog ref="addOrUpdateDrugDialog" :value="addOrUpdateDrugDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        {{ props.updateMode ? 'Modifier un médicament' : 'Ajouter un médicament' }}
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="addDrugForm" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="itemForm.drugBrandId"
                v-model:search="searchDrugBrandInput"
                clearable
                :hide-no-data="!searchDrugBrandInput"
                :loading="drugBrandIsLoading"
                label="Marque *"
                :rules="[required]"
                :items="drugBrandStore.drugBrands"
                item-title="name"
                item-value="id"
                @focus="onFocusBrandField">
                <template #no-data>
                  <v-list-item prepend-icon="mdi-plus" @click="createDrugBrand(searchDrugBrandInput!)">
                    Créer la marque: {{ searchDrugBrandInput }}
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                ref="drugNameField"
                v-model="itemForm.drugNameId"
                v-model:search="searchDrugNameInput"
                clearable
                :hide-no-data="!searchDrugNameInput"
                :disabled="!itemForm.drugBrandId"
                :loading="drugNameIsLoading"
                label="Nom *"
                :rules="[required]"
                :items="drugNameStore.drugNames"
                item-title="name"
                item-value="id"
                @focus="onFocusNameField">
                <template #no-data>
                  <v-list-item prepend-icon="mdi-plus" @click="createDrugName(searchDrugNameInput!)">
                    Créer le nom: {{ searchDrugNameInput }}
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" lg="5">
              <v-select
                v-model="itemForm.form"
                :items="drugFormItems"
                :rules="[required]"
                label="Forme *"
                item-title="label"
                item-value="value" />
            </v-col>
            <v-col cols="6" lg="4">
              <v-text-field
                v-model="itemForm.dose"
                :rules="[isFloat]"
                label="Dose"
                hint="Exemple: 1.5 ou 2"
                persistent-hint
                @input="itemForm.dose = replaceNonFloatCharacters(itemForm.dose!)" />
            </v-col>
            <v-col cols="6" lg="3">
              <v-select
                clearable
                v-model="itemForm.unit"
                :rules="[(v) => requiredIf(v, itemForm.dose), (v) => shouldBeEmptyIf(v, !itemForm.dose)]"
                :items="Object.values(DrugUnitTranslations)"
                label="Unité"
                item-title="label"
                :item-value="
                  (item) => Object.keys(DrugUnitTranslations).find((key) => DrugUnitTranslations[key] === item)
                " />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="itemForm.expirationDateTime"
                :rules="[required, isDateisFormatFr]"
                label="Date d'expiration *"
                hint="Exemple: 31/12/2022"
                persistent-hint
                maxlength="10"
                @input="itemForm.expirationDateTime = formatDateFr(itemForm.expirationDateTime!)" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="itemForm.quantity"
                :rules="[required, isNumber, min(itemForm.quantity, 1)]"
                label="Quantité *"
                @input="itemForm.quantity = replaceNonNumberCharacters(itemForm.quantity!)" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="itemForm.note" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn type="submit" :loading="userDrugIsLoading">
            {{ updateMode ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
