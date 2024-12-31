<script setup lang="ts">
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
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
                <v-text-field readonly label="Email" active :value="userStore.user?.email" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
