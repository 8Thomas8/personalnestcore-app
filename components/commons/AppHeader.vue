<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'
import { AuthRoutes, PublicRoutes } from '~/type/routes'

defineProps<{ showToggleDrawer?: boolean }>()

const { toggleAuthDialog } = useAuth()
const authStore = useAuthStore()
const router = useRouter()
const drawerIsOpened = defineModel<boolean>({ default: false })

const menu = [
  { title: 'Mon profil', to: AuthRoutes.Profile },
  { title: 'Support', to: AuthRoutes.Support },
]
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon v-if="showToggleDrawer" @click="drawerIsOpened = !drawerIsOpened" />

    <v-app-bar-title @click="router.push(PublicRoutes.Home)"> MesDrugs </v-app-bar-title>

    <div class="mx-4">
      <v-btn v-if="authStore.isAuthenticated" variant="tonal" color="primary">
        Mon profil

        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="(item, index) in menu" :key="index" :value="index" :to="item.to">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="authStore.logout">
              <v-list-item-title class="text-error">Se déconnecter</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn v-else variant="elevated" color="primary" @click="toggleAuthDialog()">Connexion</v-btn>
    </div>
  </v-app-bar>
</template>
