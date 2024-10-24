<script setup lang="ts">
import { useToastMessage } from '~/composables/useToastMessage'
import { ToastMessageDelay } from '~/type/constants'

const { toastMessage, isOpened, resetToastMessage } = useToastMessage()
</script>

<template>
  <v-snackbar v-model="isOpened" :close-delay="ToastMessageDelay" :color="toastMessage.type">
    {{ toastMessage.text }}

    <template #actions>
      <v-btn color="white" variant="text" @click="resetToastMessage"> Fermer </v-btn>
    </template>
  </v-snackbar>
</template>
