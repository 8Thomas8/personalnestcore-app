<script lang="ts" setup>
import type { VDialog, VTextField } from 'vuetify/components'
import { useFormValidation } from '~/composables/formValidation'
import { useDisplay } from 'vuetify'
import { CustomRecordView, ToastMessageType } from '~/types/constants'
import { useCustomRecordStore } from '~/store/customRecord'
import { slugify } from '~/utils/text'

const props = defineProps<{ isUpdateMode: boolean }>()
const emits = defineEmits(['update:addOrUpdateCustomRecordDialogIsOpened'])

const addOrUpdateCustomRecordDialogIsOpened = defineModel('addOrUpdateCustomRecordDialogIsOpened', {
  type: Boolean,
  default: false,
})

const { required, min, max, isFormat } = useFormValidation()
const { xs } = useDisplay()
const customRecordStore = useCustomRecordStore()
const { setToastMessage } = useToastMessage()
const router = useRouter()

const addOrUpdateCustomRecordDialog = useTemplateRef<VDialog | null>('addOrUpdateCustomRecordDialog')
const customRecordFormElt = useTemplateRef<HTMLFormElement | null>('customRecordFormElt')
const formIsValid = ref(false)
const isLoading = ref(false)
const isDialogOpened: ComputedRef<boolean> = computed(() => addOrUpdateCustomRecordDialog.value?.modelValue ?? false)
const customRecordForm = ref<{ name: string; view: CustomRecordView | null }>({ name: null, view: null })

watch(
  isDialogOpened,
  (value) => {
    if (value && props.isUpdateMode) {
      customRecordForm.value.name = customRecordStore.customRecord.name
      customRecordForm.value.view = customRecordStore.customRecord.view
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => resetForm())

const resetForm = () => {
  customRecordForm.value.name = null
  customRecordForm.value.view = null
  customRecordFormElt.value?.resetValidation()
}

const closeDialog = () => {
  emits('update:addOrUpdateCustomRecordDialogIsOpened', false)
  resetForm()
}

const onSubmit = async () => {
  if (!formIsValid.value) return
  isLoading.value = true

  const { name, view } = customRecordForm.value

  if (!props.isUpdateMode && (await customRecordStore.create({ name, view }))) {
    await customRecordStore.fetchAll()
    setToastMessage(ToastMessageType.TypeSuccess, 'Suivi ajouté avec succès')
    closeDialog()
  }
  if (props.isUpdateMode && (await customRecordStore.update(customRecordStore.customRecord.id, { name, view }))) {
    await customRecordStore.fetchOne(customRecordStore.customRecord.id)
    setToastMessage(ToastMessageType.TypeSuccess, 'Suivi modifié avec succès')
    closeDialog()
    router.replace(`suivi-${customRecordStore.customRecord.id}-${slugify(customRecordStore.customRecord.name)}`)
  }
  isLoading.value = false
}
</script>

<template>
  <v-dialog
    :fullscreen="xs"
    ref="addOrUpdateCustomRecordDialog"
    :value="addOrUpdateCustomRecordDialogIsOpened"
    max-width="600px">
    <v-card>
      <v-card-title class="bg-primary d-flex justify-space-between">
        {{ isUpdateMode ? 'Modifier le suivi' : 'Ajouter un autre suivi' }}
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="customRecordFormElt" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="customRecordForm.name"
                :rules="[
                  required,
                  min(customRecordForm.name, 4),
                  max(customRecordForm.name, 25),
                  isFormat(customRecordForm.name, /^[\p{L}0-9 ]+$/u),
                ]"
                label="Nom du suivi *"
                minLength="4"
                maxlength="25" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDialog">Annuler</v-btn>
          <v-btn variant="elevated" type="submit" :loading="isLoading">
            {{ isUpdateMode ? 'Modifier' : 'Ajouter' }}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
