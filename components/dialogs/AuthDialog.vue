<script setup lang="ts">
import { useAuthDialog } from '~/composables/useAuthDialog'
import { useFormValidation } from '~/composables/formValidation'
import { useAuthStore } from '~/store/auth'

enum STEPS {
  LOGIN = 'login',
  SIGNIN = 'signin',
  SIGNIN_SUCCESS = 'signinSuccess',
}

const { opened, toggleAuthDialog } = useAuthDialog()
const formValidation = useFormValidation()
const authStore = useAuthStore()
const step: STEPS = ref(STEPS.LOGIN)
const form = ref({ nickname: '', email: '', password: '' })
const loginFormIsValid = ref(false)
const signinFormIsValid = ref(false)
const loginForm = ref(null)
const signinForm = ref(null)
const formError = ref(null)

watch(opened, value => {
  if (!value) {
    loginForm.value.reset()
    loginForm.value.resetValidation()
    signinForm.value.reset()
    signinForm.value.resetValidation()
  }
})

watch(step, () => {
  formError.value = null
})

const login = async () => {
  try {
    if (loginFormIsValid.value) {
      const { email, password } = form.value
      await authStore.login(email, password)
      toggleAuthDialog(false)
    }
  } catch (error) {
    if (error.status === 401) {
      return (formError.value = "Votre compte n'est pas autorisé à accèder au site.")
    }

    return (formError.value = "Une erreur s'est produite, vérifiez vos informations et réessayez.")
  }
}

const signin = async () => {
  try {
    if (signinFormIsValid.value) {
      const { nickname, email, password } = form.value
      await authStore.signin(email, password, nickname)
      step.value = STEPS.SIGNIN_SUCCESS
    }
  } catch (error) {
    if (error.status === 422) {
      const errorType = []
      if (error.message.includes(el => el.field === 'password')) {
        errorType.push('mot de passe')
      }
      if (error.message.includes(el => el.field === 'email')) {
        errorType.push('adresse email')
      }
      if (error.message.includes(el => el.field === 'nickname')) {
        errorType.push('nickname')
      }

      return (formError.value = `Vérifiez le format de ${errorType.length > 1 ? 'vos' : 'vôtre'} ${errorType.join(', ')}.`)
    }

    return (formError.value = "Une erreur s'est produite, réessayez.")
  }
}
</script>

<template>
  <v-dialog v-model="opened" persistent width="auto" transition="dialog-bottom-transition">
    <v-card width="500">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 text-medium-emphasis pl-2 d-flex justify-space-between align-center">
          {{ step === STEPS.LOGIN ? 'Connexion' : 'Création de compte' }}
        </span>
        <v-btn icon="mdi-close" variant="text" @click="toggleAuthDialog(false)" />
      </v-card-title>
      <v-window v-model="step">
        <v-window-item :value="STEPS.LOGIN">
          <v-form ref="loginForm" v-model="loginFormIsValid" @submit.prevent="login">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    type="email"
                    placeholder="Email*"
                    :rules="[formValidation.required, formValidation.email]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    type="password"
                    :rules="[formValidation.required]"
                    placeholder="Mot de passe*"
                    required
                  />
                </v-col>
                <span class="text-error mx-auto py-1">{{ formError }}</span>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="step = STEPS.SIGNIN">Je n'ai pas de compte</v-btn>
              <v-btn variant="flat" type="submit">Se connecter</v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>
        <v-window-item :value="STEPS.SIGNIN">
          <v-form ref="signinForm" v-model="signinFormIsValid" @submit.prevent="signin">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.nickname"
                    type="text"
                    placeholder="Pseudo*"
                    :rules="[formValidation.required, formValidation.length(form.nickname, 3, 20)]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    type="email"
                    placeholder="Email*"
                    :rules="[
                      formValidation.required,
                      formValidation.email,
                      formValidation.length(form.email, null, 254),
                    ]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    type="password"
                    :rules="[
                      formValidation.required,
                      formValidation.password,
                      formValidation.length(form.password, 8, 180),
                    ]"
                    placeholder="Mot de passe*"
                    required
                  />
                </v-col>
                <span class="text-error mx-auto py-1">{{ formError }}</span>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="step = STEPS.LOGIN">J'ai déjà un compte</v-btn>
              <v-btn variant="flat" type="submit">Créer mon compte</v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>
        <v-window-item :value="STEPS.SIGNIN_SUCCESS">
          <v-card-text>
            <v-row>
              <v-spacer />
              <v-col cols="auto">
                <v-icon size="34" color="success">mdi-checkbox-marked-circle-outline</v-icon>
              </v-col>
              <v-spacer />
              <v-col cols="12" class="text-center text-h6">
                Félicitation, votre compte a bien été créé.
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="toggleAuthDialog(false)">Fermer</v-btn>
            <v-btn variant="flat" @click="step = STEPS.LOGIN">Se connecter</v-btn>
          </v-card-actions>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>
