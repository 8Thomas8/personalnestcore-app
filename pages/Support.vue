<script setup lang="ts">
const supportForm = {
  message: '',
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Support</v-card-title>

          <v-card-text>
            <v-row no-gutters>
              <v-alert type="info" class="mb-6">
                Pour contactez l'administration du site, proposer une suggestion ou modifier vos
                informations personnelles, n'hésitez pas à envoyer un message au support.
              </v-alert>

              <v-col cols="12">
                <v-textarea v-model="supportForm.message" label="Votre message" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" variant="elevated">Envoyer</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
