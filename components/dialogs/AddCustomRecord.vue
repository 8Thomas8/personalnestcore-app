<script lang="ts" setup>
import type { VDialog, VTextField } from 'vuetify/components'
import { useFormValidation } from '~/composables/formValidation'
import { useDisplay } from 'vuetify'
import { ToastMessageType } from '~/types/constants'
import { useCustomRecordStore } from '~/store/customRecord'

const emits = defineEmits(['update:addCustomRecordDialogIsOpened'])

const addCustomRecordDialogIsOpened = defineModel('addCustomRecordDialogIsOpened', {
  type: Boolean,
  default: false,
})

const addCustomRecordDialog = useTemplateRef<HTMLFormElement | null>('addCustomRecordDialog')
const customRecordForm = useTemplateRef<HTMLFormElement | null>('customRecordForm')
const formIsValid = ref(false)
const isLoading = ref(false)
const { required, min, max } = useFormValidation()
const { xs } = useDisplay()
const customRecordStore = useCustomRecordStore()
const { setToastMessage } = useToastMessage()

const customRecordName = ref<string>(null)

onBeforeUnmount(() => {
  resetForm()
})

const resetForm = () => {
  customRecordName.value = null
  customRecordForm.value?.resetValidation()
}

const closeDialog = () => {
  emits('update:addCustomRecordDialogIsOpened', false)
  resetForm()
}

const onSubmit = async () => {
  if (!formIsValid.value) return
  isLoading.value = true

  if (await customRecordStore.create({ name: customRecordName.value, view: null })) {
    await customRecordStore.fetchAll()
    resetForm()
    setToastMessage(ToastMessageType.TypeSuccess, 'Médicament ajouté avec succès')
    closeDialog()
  }
  isLoading.value = false
}
</script>

<template>
  <v-dialog :fullscreen="xs" ref="addCustomRecordDialog" :value="addCustomRecordDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Ajouter un autre suivi
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="customRecordForm" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="customRecordName"
                :rules="[required, min(4), max(15)]"
                label="Nom du suivi *"
                hide-details
                minLength="4"
                maxlength="15" />
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
