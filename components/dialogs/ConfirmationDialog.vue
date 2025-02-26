<script setup lang="ts">
defineProps<{
  text: string
}>()

const emits = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <v-dialog persistent max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between"> Confirmation</v-card-title>
      <v-card-text>
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="emits('cancel')">Annuler</v-btn>
        <v-btn variant="elevated" color="primary" @click="emits('confirm')">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
