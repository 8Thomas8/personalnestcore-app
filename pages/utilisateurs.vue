<script lang="ts" setup>
import { useUserStore } from '~/store/user'
import type UserDto from '~/dto/UserDto'
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue'
import { ServiceRoutes } from '~/types/routes'
import { useDisplay } from 'vuetify'

useHead({ title: 'Utilisateurs' })

const addOrUpdateDialogIsOpened = ref(false)

const userStore = useUserStore()
const { smAndUp } = useDisplay()

const isLoading = ref(false)
const updateMode = ref(false)
const userToUpdate = ref<UserDto | null>(null)
const userToDelete = ref<UserDto | null>(null)
const confirmationDialogIsOpened = ref(false)

const headers = [
  { title: 'Pseudo', key: 'username', align: 'start' },
  { title: 'Création', key: 'createdAt', align: 'center d-none d-sm-table-cell' },
  { title: 'Mise à jour', key: 'updatedAt', align: 'center d-none d-sm-table-cell' },
  { title: 'Actions', key: 'actions', align: 'end' },
]

onBeforeMount(async () => await fetchUsersData())

const fetchUsersData = async () => {
  isLoading.value = true
  await userStore.fetchAll()
  isLoading.value = false
}

const onAddUser = () => {
  userToUpdate.value = null
  updateMode.value = false
  addOrUpdateDialogIsOpened.value = true
}

const onClickDelete = (user: UserDto) => {
  userToDelete.value = user
  confirmationDialogIsOpened.value = true
}
const onDeleteConfirmation = async () => {
  if (userToDelete.value) {
    isLoading.value = true
    await userStore.deleteOne(userToDelete.value.id)
    userToDelete.value = null
    await userStore.fetchAll()
    isLoading.value = false
    confirmationDialogIsOpened.value = false
  }
}

const onCancelDelete = () => {
  userToDelete.value = null
  confirmationDialogIsOpened.value = false
}

const onClickUpdate = (user: UserDto) => {
  updateMode.value = true
  userToUpdate.value = user
  addOrUpdateDialogIsOpened.value = true
}
</script>

<template>
  <v-container max-width="1144">
    <v-row>
      <v-col>
        <v-btn :to="{ path: ServiceRoutes.Pharmacy }" class="my-4" variant="text" prepend-icon="mdi-keyboard-return">
          Retour aux services
        </v-btn>

        <v-card class="pa-2 pa-sm-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account-group" class="mr-2" /> Utilisateurs
          </v-card-title>
          <v-row>
            <v-spacer />
            <v-col cols="auto" class="d-flex align-center">
              <v-btn @click="onAddUser()">
                <v-icon icon="mdi-plus" /><span class="d-none d-sm-inline ml-2">Ajouter</span>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-data-table-server
                :headers="headers"
                :loading="isLoading"
                loading-text="Récupération des utilisateurs en cours..."
                :items="userStore.users"
                :items-length="userStore.users?.length ?? 0"
                :items-per-page-options="[
                  { value: 5, title: '5' },
                  { value: 10, title: '10' },
                  { value: 20, title: '20' },
                ]"
                no-data-text="Aucun utilisateur">
                <template #[`item.actions`]="{ item }">
                  <div class="d-flex flex-wrap ga-2 py-2 py-xs-0 justify-end">
                    <v-btn
                      variant="elevated"
                      color="info"
                      @click="onClickUpdate(item)"
                      :min-width="smAndUp ? '46px' : '32px'"
                      class="px-0">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn
                      variant="elevated"
                      color="red"
                      @click="onClickDelete(item)"
                      :min-width="smAndUp ? '46px' : '32px'"
                      class="px-0">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table-server>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <AddOrUpdateUserDialog
      v-model:is-opened="addOrUpdateDialogIsOpened"
      :update-mode="updateMode"
      :user-to-update="userToUpdate" />

    <ConfirmationDialog
      v-model="confirmationDialogIsOpened"
      text="Voulez-vous supprimer cet utilisateur ?"
      :is-loading="isLoading"
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </v-container>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as *;

:deep(.v-data-table__tr) {
  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.02);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  :deep(.v-data-table__tr) {
    font-size: 12px;
  }

  :deep(.v-data-table__td) {
    padding: 0 4px !important;
  }
}
</style>
