<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { AuthRoutes } from '~/type/routes'

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
              <v-alert type="info" class="mb-6"
                >Les informations de votre profil ne sont pas modifiables pour le moment. Vous
                pouvez faire une demande en ce sens via la page
                <nuxt-link :to="AuthRoutes.Support">Support</nuxt-link></v-alert
              >

              <v-col cols="12">
                <v-text-field readonly label="Pseudo" active :value="userStore.user?.username" />
              </v-col>
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
