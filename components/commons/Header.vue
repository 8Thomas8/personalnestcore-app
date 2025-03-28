<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'
import { AccountRoutes, PublicRoutes } from '~/types/routes'
import { useDisplay } from 'vuetify'

defineProps<{ navDrawerIsActive?: boolean }>()

const drawerIsOpened = defineModel<boolean | null>({ default: false })

const { toggleAuthDialog } = useAuth()
const authStore = useAuthStore()
const router = useRouter()
const { lgAndUp } = useDisplay()

const menu = ref([{ title: 'Mon profil', to: AccountRoutes.Profile }])

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      menu.value.push({ title: 'Utilisateurs', to: AccountRoutes.Users })
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon v-if="!lgAndUp && navDrawerIsActive" @click="drawerIsOpened = !drawerIsOpened" />

    <v-app-bar-title @click="router.push(PublicRoutes.Home)" class="d-flex align-center">
      <img alt="PersonalNestCore" src="/images/logos/pnc_desktop.svg" class="d-none d-sm-block" />
      <img alt="PersonalNestCore" src="/images/logos/pnc_mobile.svg" class="d-sm-none" />
    </v-app-bar-title>

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

<style lang="scss">
.v-toolbar-title__placeholder {
  display: flex;
  align-content: center;
}
</style>
