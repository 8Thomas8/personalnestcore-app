<script setup lang="ts">
import { useToastMessage } from '~/composables/useToastMessage'
import { ToastMessageDelay } from '~/types/constants'

const { toastMessage, toastType, toastIsOpened, resetToastMessage } = useToastMessage()
</script>

<template>
  <v-snackbar v-model="toastIsOpened" :close-delay="ToastMessageDelay" :color="toastType">
    {{ toastMessage }}
    <template #actions>
      <v-btn text @click="resetToastMessage">Fermer</v-btn>
    </template>
  </v-snackbar>
</template>
