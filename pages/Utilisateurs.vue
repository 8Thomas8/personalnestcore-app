<script lang="ts" setup>
import { useUserStore } from '~/store/user'
import AddOrUpdateUserDialog from '~/components/dialogs/AddOrUpdateUserDialog.vue'
import type UserDto from '~/dto/UserDto'
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue'
import { ServiceRoutes } from '~/types/routes'

const userStore = useUserStore()

const addOrUpdateMemberDialogIsOpened = defineModel({ default: false, type: Boolean })

const isLoading = ref(false)
const updateMode = ref(false)
const memberToUpdate = ref(null)
const userToUpdate = ref<UserDto | null>(null)
const userToDelete = ref<UserDto | null>(null)
const confirmationDialogIsOpened = ref(false)

const headers = [
  { title: 'Pseudo', key: 'username', sortable: true, align: 'center' },
  { title: 'Création', key: 'createdAt', sortable: true, align: 'center' },
  { title: 'Mise à jour', key: 'updatedAt', sortable: true, align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

onBeforeMount(async () => {
  await fetchUsersData()
})

const fetchUsersData = async () => {
  try {
    isLoading.value = true
    await userStore.fetchAll()
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}

const onAddMember = () => {
  memberToUpdate.value = null
  updateMode.value = false
  addOrUpdateMemberDialogIsOpened.value = true
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
  addOrUpdateMemberDialogIsOpened.value = true
}
</script>

<template>
  <v-container max-width="1144">
    <v-row>
      <v-col>
        <v-btn :to="{ path: ServiceRoutes.Pharmacy }" class="my-4" variant="text" prepend-icon="mdi-keyboard-return">
          Retour aux services
        </v-btn>

        <v-card>
          <v-card-title>Utilisateurs</v-card-title>

          <v-card-text>
            <v-row>
              <v-spacer />
              <v-col cols="auto">
                <v-btn prepend-icon="mdi-plus" @click="onAddMember()">Ajouter</v-btn>
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
                    <v-btn
                      variant="elevated"
                      color="warning"
                      @click="onClickUpdate(item)"
                      min-width="46px"
                      class="mr-2 px-0">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn variant="elevated" color="error" @click="onClickDelete(item)" min-width="46px" class="px-0">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table-server>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AddOrUpdateUserDialog
      v-model="addOrUpdateMemberDialogIsOpened"
      :update-mode="updateMode"
      :user-to-update="userToUpdate"
      @update:add-or-update-member-dialog-is-opened="addOrUpdateMemberDialogIsOpened = false" />

    <ConfirmationDialog
      v-model="confirmationDialogIsOpened"
      text="Voulez-vous supprimer cet utilisateur ?"
      @confirm="onDeleteConfirmation"
      @cancel="onCancelDelete" />
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-data-table__tr) {
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}
</style>
