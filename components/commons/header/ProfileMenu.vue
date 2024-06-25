<script lang="ts" setup>
import { useAuthDialog } from '~/composables/useAuthDialog'
import { useUserStore } from '~/store/user'
import { useAuthStore } from '~/store/auth'

const authDialog = useAuthDialog()
const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
</script>

<template>
  <v-btn
    v-if="!userStore.user"
    width="200px"
    class="mx-2"
    color="primary"
    text="Connexion"
    @click="authDialog.toggleAuthDialog"
  />
  <template v-else>
    <v-btn
      v-if="!route.fullPath.includes('app') || route.fullPath.includes('profil')"
      color="primary"
      to="/app"
    >
      <v-icon class="mr-1">mdi-apps</v-icon>
      Application
    </v-btn>
    <v-menu>
      <template #activator="{ props }">
        <v-btn variant="tonal" color="primary" v-bind="props">
          <v-icon class="mr-1">mdi-account</v-icon>
          {{ userStore.user?.nickname }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/app/profil">
          <v-list-item-title> Mon profil </v-list-item-title>
        </v-list-item>
        <v-list-item class="text-error" @click="authStore.logout">
          <v-list-item-title> Logout </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
</template>
