<script setup lang="ts">
import { useFormValidation } from '~/composables/formValidation'
import { ToastMessageType } from '~/types/constants'
import type { VDialog, VTextField } from 'vuetify/components'
import type UserDto from '~/types/dto/UserDto'
import { useUserStore } from '~/store/user'

const addOrUpdateMemberDialogIsOpened = defineModel('addOrUpdateMemberDialogIsOpened', {
  type: Boolean,
  default: false,
})

const emits = defineEmits(['update:addOrUpdateMemberDialogIsOpened'])
const props = defineProps<{
  updateMode: boolean
  userToUpdate: UserDto | null
}>()

const { required, email, password } = useFormValidation()
const userStore = useUserStore()
const { setToastMessage } = useToastMessage()

const addOrUpdateMemberDialog = ref<VDialog>()

const isLoading = ref(false)
const userToUpdateIsFilled = ref(false)
const formIsValid = ref(false)
const addUserForm = ref<HTMLFormElement | null>(null)
const displayEmptyError = ref(false)

const isDialogOpened: ComputedRef<boolean> = computed(
  () => addOrUpdateMemberDialog.value?.modelValue ?? false,
)

const userForm = ref<{
  email: string | null
  password: string | null
}>({
  email: null,
  password: null,
})

const onSubmit = async () => {
  if (!props.updateMode && !formIsValid.value) return

  if (!userForm.value.password && !userForm.value.email) {
    return (displayEmptyError.value = true)
  }

  isLoading.value = true

  if (props.updateMode) {
    await userStore.updateUser({ ...userForm.value, ...{ id: props.userToUpdate!.id } })
    await userStore.fetchUsers()
    setToastMessage(ToastMessageType.TypeSuccess, 'Utilisateur modifié avec succès')
    closeDialog()
  } else {
    await userStore.createUser(userForm.value)
    await userStore.fetchUsers()

    setToastMessage(ToastMessageType.TypeSuccess, 'Médicament ajouté avec succès')
    closeDialog()
  }
  isLoading.value = false
}

const resetForm = () => {
  userForm.value = {
    email: null,
    password: null,
  }
  addUserForm.value?.resetValidation()
}

watch(isDialogOpened, async (isOpened: boolean) => {
  if (isOpened && props.updateMode && props.userToUpdate) {
    const { email, password } = props.userToUpdate

    userForm.value.email = email
    userForm.value.password = password ?? null
  }

  if (!isOpened && props.updateMode) {
    userToUpdateIsFilled.value = false
  }
})

watch(
  userForm.value,
  () => {
    if (displayEmptyError.value) {
      displayEmptyError.value = false
      addUserForm.value?.resetValidation()
    }
  },
  { deep: true },
)

onBeforeUnmount(() => {
  resetForm()
})

const closeDialog = () => {
  emits('update:addOrUpdateMemberDialogIsOpened', false)
  resetForm()
}
</script>

<template>
  <v-dialog ref="addOrUpdateUserDialog" :value="addOrUpdateMemberDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        {{ props.updateMode ? 'Modifier un utilisateur' : 'Ajouter un utilisateur' }}
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="addUserForm" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.email"
                :label="`Email ${updateMode ? '' : '*'}`"
                :rules="[updateMode ? () => true : required, email]"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.password"
                :label="`Mot de passe ${updateMode ? '' : '*'}`"
                :rules="[updateMode ? () => true : required, password]"
              />
            </v-col>
          </v-row>
          <p v-if="displayEmptyError" class="text-center text-error">
            Au moins une valeur doit être renseignée.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn type="submit" :loading="isLoading">
            {{ updateMode ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
