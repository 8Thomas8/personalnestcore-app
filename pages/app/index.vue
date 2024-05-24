<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
</script>

<template>
  <v-btn color="error" @click="authStore.logout()">Logout {{ authStore.isAuthenticated }}</v-btn>
</template>
