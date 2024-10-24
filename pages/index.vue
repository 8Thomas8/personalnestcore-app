<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'

const { toggleAuthDialog } = useAuth()
const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1>Index page</h1>

    <v-row>
      <v-col>
        <v-btn v-if="authStore.isAuthenticated" @click="authStore.logout">Logout</v-btn>
        <v-btn v-else @click="toggleAuthDialog()">Login</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
