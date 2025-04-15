<script setup lang="ts">
import { useFormValidation } from '~/composables/formValidation'
import type { VDialog, VTextField } from 'vuetify/components'
import type UserDto from '~/dto/UserDto'
import { useUserStore } from '~/store/user'
import { useDisplay } from 'vuetify'

const addOrUpdateUserDialogIsOpened = defineModel('addOrUpdateUserDialogIsOpened', {
  type: Boolean,
  default: false,
})

const emits = defineEmits(['update:addOrUpdateUserDialogIsOpened'])
const props = defineProps<{
  updateMode: boolean
  userToUpdate: UserDto | null
}>()

const { required, username, password } = useFormValidation()
const userStore = useUserStore()
const { xs } = useDisplay()

const addOrUpdateUserDialog = ref<VDialog>()

const isLoading = ref(false)
const userToUpdateIsFilled = ref(false)
const formIsValid = ref(false)
const addUserForm = ref<HTMLFormElement | null>(null)
const displayEmptyError = ref(false)

const isDialogOpened: ComputedRef<boolean> = computed(() => addOrUpdateUserDialog.value?.modelValue ?? false)

const userForm = ref<{
  username: string | null
  password: string | null
}>({
  username: null,
  password: null,
})

const onSubmit = async () => {
  if (!props.updateMode && !formIsValid.value) return

  if (!userForm.value.password && !userForm.value.username) {
    return (displayEmptyError.value = true)
  }

  isLoading.value = true

  if (props.updateMode) {
    await userStore.update({ ...userForm.value, ...{ id: props.userToUpdate!.id } })
  } else {
    await userStore.create(userForm.value)
  }
  await userStore.fetchAll()
  closeDialog()
  isLoading.value = false
}

const resetForm = () => {
  userForm.value = {
    username: null,
    password: null,
  }
  addUserForm.value?.resetValidation()
}

watch(isDialogOpened, async (isOpened: boolean) => {
  if (isOpened && props.updateMode && props.userToUpdate) {
    const { username } = props.userToUpdate
    userForm.value.username = username
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
  { deep: true }
)

onBeforeUnmount(() => resetForm())

const closeDialog = () => {
  emits('update:addOrUpdateUserDialogIsOpened', false)
  resetForm()
}
</script>

<template>
  <v-dialog :fullscreen="xs" ref="addOrUpdateUserDialog" :value="addOrUpdateUserDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="bg-primary d-flex justify-space-between">
        {{ props.updateMode ? 'Modifier un utilisateur' : 'Ajouter un utilisateur' }}
        <v-icon size="24" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-form ref="addUserForm" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.username"
                :label="`Pseudo ${updateMode ? '' : '*'}`"
                :rules="[updateMode ? () => true : required, username]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.password"
                :label="`Mot de passe ${updateMode ? '' : '*'}`"
                :rules="[updateMode ? () => true : required, password]" />
            </v-col>
          </v-row>
          <p v-if="displayEmptyError" class="text-center text-error">Au moins une valeur doit être renseignée.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDialog">Annuler</v-btn>
          <v-btn variant="elevated" type="submit" :loading="isLoading">
            {{ updateMode ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
