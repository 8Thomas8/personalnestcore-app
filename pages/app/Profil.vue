<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const { user } = useUserStore()

const form = ref({
  nickname: null,
  email: null,
})

onMounted(() => {
  form.value.nickname = user?.nickname
  form.value.email = user?.email
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Mon Profil</v-card-title>
      <v-card-text>
        <v-row
          ><v-col cols="12">
            <v-alert type="info" variant="tonal">
              Ces informations sont disponibles en lecture seule. Si vous souhaitez modifier votre
              pseudo, email ou mot de passe, merci de contacter l'administrateur.
            </v-alert>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.nickname"
              variant="outlined"
              type="text"
              label="Pseudo"
              readonly
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.email"
              variant="outlined"
              type="email"
              label="Adresse email"
              readonly
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
