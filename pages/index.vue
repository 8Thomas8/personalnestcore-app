<script setup lang="ts">
import { useAuthDialog } from '~/composables/useAuthDialog'

const { toggleAuthDialog } = useAuthDialog()
</script>

<template>
  <v-container>
    <h1>Index page</h1>
    <v-btn
      width="200px"
      class="mx-2"
      color="primary"
      text="Open Auth Dialog"
      @click="toggleAuthDialog()"
    />
  </v-container>
</template>
