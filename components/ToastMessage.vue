<script setup lang="ts">
import { useToastMessage } from '~/composables/useToastMessage'
import { ToastMessageDelay } from '~/type/constants'

const { toastMessage, toastType, toastIsOpened, resetToastMessage } = useToastMessage()
</script>

<template>
  <v-snackbar v-model="toastIsOpened" :close-delay="ToastMessageDelay" :color="toastType">
    {{ toastMessage }}

    <template #actions>
      <v-btn color="white" variant="text" @click="resetToastMessage"> Fermer </v-btn>
    </template>
  </v-snackbar>
</template>
