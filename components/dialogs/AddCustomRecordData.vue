<script lang="ts" setup>
import type { VDialog } from 'vuetify/components'
import { useFormValidation } from '~/composables/formValidation'
import { useDisplay } from 'vuetify'
import { ToastMessageType } from '~/types/constants'
import { useCustomRecordDataStore } from '~/store/customRecordData'

const props = defineProps<{ customRecordId: number }>()
const emits = defineEmits(['update:addCustomRecordDataDialogIsOpened'])

const addCustomRecordDataDialogIsOpened = defineModel('addCustomRecordDataDialogIsOpened', {
  type: Boolean,
  default: false,
})

const { required, max } = useFormValidation()
const { xs } = useDisplay()
const customRecordDataStore = useCustomRecordDataStore()
const { setToastMessage } = useToastMessage()

const addCustomRecordDataDialog = useTemplateRef<VDialog | null>('addCustomRecordDataDialog')
const customRecordDataFormElt = useTemplateRef<HTMLFormElement | null>('customRecordDataFormElt')
const formIsValid = ref(false)
const isLoading = ref(false)
const date = ref<Date>()
const time = ref<string>()
const customRecordDataForm = ref<{ content: string | null; datetime: string | null }>({ content: null, datetime: null })

watch([time, date], () => {
  if (!date.value || !time.value?.split(':').length) return
  const dateObj = new Date(date.value)
  const [hours, minutes] = time.value.split(':')

  dateObj.setHours(parseInt(hours))
  dateObj.setMinutes(parseInt(minutes))

  customRecordDataForm.value.datetime = dateObj.toISOString()
})

onBeforeUnmount(() => {
  resetForm()
})

const resetForm = () => {
  customRecordDataForm.value.datetime = null
  customRecordDataForm.value.content = null
  customRecordDataFormElt.value?.resetValidation()
}

const closeDialog = () => {
  emits('update:addCustomRecordDataDialogIsOpened', false)
  resetForm()
}

const onSubmit = async () => {
  if (!formIsValid.value) return
  isLoading.value = true

  const { content, datetime } = customRecordDataForm.value

  if (await customRecordDataStore.create(props.customRecordId, { content, datetime })) {
    await customRecordDataStore.fetchAll(props.customRecordId)
    setToastMessage(ToastMessageType.TypeSuccess, 'Donnée ajoutée avec succès')
    closeDialog()
  }
  isLoading.value = false
}
</script>

<template>
  <v-dialog
    :fullscreen="xs"
    ref="addCustomRecordDataDialog"
    :value="addCustomRecordDataDialogIsOpened"
    max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Ajouter une donnée
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="customRecordDataFormElt" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex ga-4">
              <v-locale-provider locale="fr">
                <v-date-input
                  location="fr"
                  first-day-of-week="1"
                  :show-adjacent-months="false"
                  v-model="date"
                  clearable
                  :rules="[required]"
                  prepend-icon="mdi-calendar"
                  placeholder="Date" />
                <v-text-field
                  :rules="[required]"
                  v-model="time"
                  type="time"
                  prepend-icon="mdi-clock-time-four-outline"
                  placeholder="Heure" />
              </v-locale-provider>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="customRecordDataForm.content"
                :rules="[required, max(customRecordDataForm.content, 500)]"
                label="Donnée *"
                maxlength="500" />
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
