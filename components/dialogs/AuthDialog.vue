<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'
import { useFormValidation } from '~/composables/formValidation'

enum STEP {
  SIGNIN = 'signin',
  LOGIN = 'login',
}

const { authDialogIsOpened, toggleAuthDialog } = useAuth()
const { required, email, password, passwordConfirmation } = useFormValidation()
const authStore = useAuthStore()
const isLoading = ref(false)
const step = ref(STEP.LOGIN)
const adminCanRegister = ref(false)

const form = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
})

const formIsValid = ref(false)

watch(authDialogIsOpened, (isOpened: boolean) => {
  if (!isOpened) {
    resetForm()
  }
})

const onSubmit = async () => {
  if (!formIsValid.value) return

  const { email, password } = form.value
  isLoading.value = true
  if (step.value === STEP.LOGIN) {
    await authStore.login(email, password)
  } else {
    await authStore.register(email, password)
    await authStore.login(email, password)
  }
  isLoading.value = false
}

const resetForm = () => {
  form.value.email = ''
  form.value.password = ''
  form.value.passwordConfirmation = ''
}

onBeforeMount(async () => {
  adminCanRegister.value = await authStore.adminCanRegister()
  if (adminCanRegister.value) {
    step.value = STEP.SIGNIN
  }
})
</script>

<template>
  <v-dialog v-model="authDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        {{ step === STEP.LOGIN ? 'Connexion' : 'Création du compte admin' }}
        <v-btn color="grey" variant="text" @click="toggleAuthDialog(false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-form v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model.trim="form.email" placeholder="Email *" type="email" :rules="[required, email]" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                placeholder="Mot de passe *"
                type="password"
                :rules="[required, password]" />
            </v-col>
            <v-col v-if="step === STEP.SIGNIN" cols="12">
              <v-text-field
                v-model="form.passwordConfirmation"
                placeholder="Confirmation du mot de passe *"
                type="password"
                :rules="[required, passwordConfirmation(form.passwordConfirmation, form.password)]" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn type="submit" :loading="isLoading">
            {{ adminCanRegister && step === STEP.SIGNIN ? ' Création' : 'Connexion' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
