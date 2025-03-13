<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { ServiceRoutes } from '~/types/routes'

useHead({
  title: 'Mon Profil',
})

const authStore = useAuthStore()
</script>

<template>
  <v-container max-width="1144">
    <v-row>
      <v-col>
        <v-btn :to="{ path: ServiceRoutes.Pharmacy }" class="my-4" variant="text" prepend-icon="mdi-keyboard-return">
          Retour aux services
        </v-btn>

        <v-card class="pa-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account" class="mr-2" /> Mon compte
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field readonly label="Pseudo" active :value="authStore.user?.username" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
