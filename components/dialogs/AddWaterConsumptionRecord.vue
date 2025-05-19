<script lang="ts" setup>
import type { VDialog, VTextField } from 'vuetify/components'
import { useFormValidation } from '~/composables/formValidation'
import { useDisplay } from 'vuetify'
import { ToastMessageType } from '~/types/constants'
import { useWaterConsumptionRecordStore } from '~/store/waterConsumptionRecord'

const props = defineProps<{ startDate: string; endDate: string; currentPage: number; itemPerPage: number }>()
const emits = defineEmits(['update:addWaterConsumptionRecordDialogIsOpened'])

const addWaterConsumptionRecordDialogIsOpened = defineModel('addWaterConsumptionRecordDialogIsOpened', {
  type: Boolean,
  default: false,
})

const { required, isFloat } = useFormValidation()
const { xs } = useDisplay()
const waterConsumptionRecordStore = useWaterConsumptionRecordStore()
const { setToastMessage } = useToastMessage()

const addWaterConsumptionRecordDialog = useTemplateRef<VDialog | null>('addOrUpdateWaterConsumptionRecordDialog')
const recordFormElt = useTemplateRef<HTMLFormElement | null>('recordFormElt')
const formIsValid = ref(false)
const isLoading = ref(false)
const date = ref<Date>()

const recordForm = ref<{ index: number; date: string; comment: string | null }>({
  index: null,
  date: null,
  comment: null,
})

watch([date], () => {
  if (!date.value) return
  recordForm.value.date = dateToString(new Date(date.value))
})

onBeforeUnmount(() => resetForm())

const resetForm = () => {
  recordForm.value.index = null
  recordForm.value.date = null
  recordForm.value.comment = null
  recordFormElt.value?.resetValidation()
}

const closeDialog = () => {
  emits('update:addWaterConsumptionRecordDialogIsOpened', false)
  resetForm()
}

const onSubmit = async () => {
  if (!formIsValid.value) return
  isLoading.value = true

  const { index, date, comment } = recordForm.value

  if (await waterConsumptionRecordStore.create({ index, date, comment })) {
    await waterConsumptionRecordStore.fetchAll({
      startDate: dateToString(props.startDate),
      endDate: dateToString(props.endDate),
      currentPage: props.currentPage,
      itemPerPage: props.itemPerPage,
    })
    await waterConsumptionRecordStore.fetchWaterConsumptionAverageInRange({
      startDate: dateToString(props.startDate),
      endDate: dateToString(props.endDate),
    })
    await waterConsumptionRecordStore.fetchWaterConsumptionAverageInCurrentYear()
    setToastMessage(ToastMessageType.TypeSuccess, 'Donnée ajoutée avec succès')
    closeDialog()
  }
  isLoading.value = false
}
</script>

<template>
  <v-dialog
    :fullscreen="xs"
    ref="addWaterConsumptionRecordDialog"
    :value="addWaterConsumptionRecordDialogIsOpened"
    max-width="600px">
    <v-card>
      <v-card-title class="bg-primary d-flex justify-space-between">
        Ajouter une donnée <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="recordFormElt" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-locale-provider locale="fr">
                <v-date-input
                  color="blue"
                  location="fr"
                  first-day-of-week="1"
                  :show-adjacent-months="false"
                  v-model="date"
                  clearable
                  :rules="[required]"
                  prepend-icon="mdi-calendar"
                  placeholder="Date" />
              </v-locale-provider>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="recordForm.index" :rules="[required, isFloat]" label="Index du compteur *" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="recordForm.comment" label="Commentaire" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDialog">Annuler</v-btn>
          <v-btn variant="elevated" type="submit" :loading="isLoading"> Ajouter </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
