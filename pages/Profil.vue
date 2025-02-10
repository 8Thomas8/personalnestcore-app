<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { ServiceRoutes } from '~/types/routes'

const authStore = useAuthStore()
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn :to="{ path: ServiceRoutes.Pharmacy }" class="my-4" variant="text" prepend-icon="mdi-keyboard-return">
          Retour aux services
        </v-btn>

        <v-card>
          <v-card-title>Mon Profil</v-card-title>

          <v-card-text>
            <v-row no-gutters>
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
