<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
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
