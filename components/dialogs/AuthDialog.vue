<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'

const { authDialogIsOpened, toggleAuthDialog } = useAuth()
const authStore = useAuthStore()
const isLoading = ref(false)

const loginForm = {
  identifier: '',
  password: '',
}

const onSubmit = async () => {
  const { identifier, password } = loginForm
  isLoading.value = true
  await authStore.login(identifier, password)
  isLoading.value = false
}
</script>

<template>
  <v-dialog v-model="authDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title>Connexion</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="loginForm.identifier" placeholder="email" type="email" />
              <v-text-field
                v-model="loginForm.password"
                placeholder="mot de passe"
                type="password"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="toggleAuthDialog(false)">Annuler</v-btn>
          <v-btn type="submit" :loading="isLoading">Connexion</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
