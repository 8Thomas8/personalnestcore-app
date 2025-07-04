<script setup lang="ts">
import { useKitStore } from '~/store/kit'
import KitDto from '~/dto/Kit'
import { ToastMessageType } from '~/types/constants'
import { capitalize } from 'vue'

const kitStore = useKitStore()
const { setToastMessage } = useToastMessage()

const newItemInput = templateRef('newItemInput', null)
const isLoading = ref(true)
const kitIsLoading = ref(false)
const selectedKit = ref<KitDto>(null)
const newItemName = ref<string>()
const newKitName = ref<string>()

const { refresh } = useAsyncData(
  async () => {
    isLoading.value = true
    await kitStore.fetchAll()
    isLoading.value = false
  },
  { immediate: true }
)

const addNewItem = async () => {
  if (!newItemName.value) return

  kitIsLoading.value = true
  const newItem = { name: newItemName.value.trim(), checked: false }
  if (
    await kitStore.update(selectedKit.value.id, {
      name: selectedKit.value.name,
      list: [...selectedKit.value.list, newItem],
    })
  ) {
    selectedKit.value.list.push(newItem)
    selectedKit.value.list = selectedKit.value.list.sort((a, b) => a.name.localeCompare(b.name))
    newItemName.value = ''
    setToastMessage(ToastMessageType.TypeSuccess, 'Kit mis à jour avec succès')
  }
  kitIsLoading.value = false
}

const addNewKit = async () => {
  if (!newKitName.value) return

  isLoading.value = true
  try {
    await kitStore.create(newKitName.value.trim())
    setToastMessage(ToastMessageType.TypeSuccess, 'Nouveau kit créé avec succès')
    isLoading.value = true
    await refresh()
    selectedKit.value = kitStore.kits.find((kit) => kit.name === newKitName.value) || null
    newKitName.value = ''
  } catch {
    setToastMessage(ToastMessageType.TypeError, 'Erreur lors de la création du kit')
  }
  isLoading.value = false
}

const deleteSelectedKit = async () => {
  isLoading.value = true
  kitIsLoading.value = true
  try {
    await kitStore.deleteOne(selectedKit.value.id)
    selectedKit.value = null
    setToastMessage(ToastMessageType.TypeSuccess, 'Kit supprimé avec succès')
    await refresh()
  } catch {
    setToastMessage(ToastMessageType.TypeError, 'Erreur lors de la suppression du kit')
  }
  kitIsLoading.value = false
  isLoading.value = false
}

const deleteItem = async (item) => {
  kitIsLoading.value = true
  try {
    if (
      await kitStore.update(selectedKit.value.id, {
        name: selectedKit.value.name,
        list: selectedKit.value.list.filter((i) => i.name !== item.name),
      })
    ) {
      selectedKit.value.list = selectedKit.value.list.filter((i) => i.name !== item.name)
      setToastMessage(ToastMessageType.TypeSuccess, 'Item supprimé avec succès')
    } else {
      setToastMessage(ToastMessageType.TypeError, "Erreur lors de la suppression de l'item")
    }
  } catch {
    setToastMessage(ToastMessageType.TypeError, "Erreur lors de la suppression de l'item")
  }
  kitIsLoading.value = false

  newItemInput.value.focus()
}

const updateSelectedKit = async () => {
  kitIsLoading.value = true
  try {
    if (
      await kitStore.update(selectedKit.value.id, {
        name: selectedKit.value.name,
        list: selectedKit.value.list,
      })
    ) {
      setToastMessage(ToastMessageType.TypeSuccess, 'Item modifié avec succès')
    } else {
      setToastMessage(ToastMessageType.TypeError, "Erreur lors de la modification de l'item")
    }
  } catch {
    setToastMessage(ToastMessageType.TypeError, "Erreur lors de la suppression de l'item")
  }
  kitIsLoading.value = false
}
</script>

<template>
  <div>
    <v-container max-width="1144">
      <v-card class="pa-2 pa-sm-4">
        <v-progress-circular color="primary" indeterminate v-if="isLoading" class="d-block mx-auto my-4" />
        <v-row v-else>
          <v-col class="mt-4">
            <v-select
              v-model="selectedKit"
              :items="kitStore.kits"
              item-text="name"
              item-title="name"
              return-object
              label="Sélectionnez un kit"
              outlined>
              <template #prepend-item>
                <div class="d-flex px-4">
                  <v-text-field
                    @keydown.space.stop
                    @mousedown.stop
                    variant="filled"
                    v-model="newKitName"
                    label="Ajouter un nouveau Kit"
                    hide-details
                    outlined
                    clearable
                    :loading="isLoading"
                    @keyup.enter="addNewKit()" />
                  <v-btn :loading="isLoading" height="56px" color="primary" @click="addNewKit()">
                    <v-icon icon="mdi-plus" />
                  </v-btn>
                </div>
                <v-divider class="my-2" />
              </template>
            </v-select>
          </v-col>
          <v-divider />
          <v-col cols="12">
            <v-card-title class="align-center d-flex ga-6">
              <span class="font-weight-bold">Liste :</span>
              <span class="font-italic">
                {{ capitalize(selectedKit?.name ?? 'Sélectionnez un kit pour voir les détails') }}</span
              >
              <v-btn variant="outlined" v-if="selectedKit" size="36px" color="red" @click="deleteSelectedKit()">
                <v-icon size="18px">mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
          </v-col>
          <v-cols v-if="selectedKit" cols="12">
            <v-list>
              <v-list-item v-if="selectedKit.list.length === 0">
                <v-list-item-content>
                  <v-list-item-title>Aucun item dans ce kit</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-else
                :key="item.name"
                v-for="item in selectedKit.list.sort((a, b) => a.name)"
                class="d-flex">
                <v-list-item-content class="d-flex align-center ga-8">
                  <v-checkbox
                    :loading="kitIsLoading"
                    hide-details
                    :label="item.name"
                    v-model="item.checked"
                    @update:modelValue="updateSelectedKit()" />
                  <v-btn variant="outlined" :loading="kitIsLoading" size="26px" color="red" @click="deleteItem(item)">
                    <v-icon size="16px">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold"> Ajouter un nouvel item </v-list-item-title>
                <v-list-item-content class="d-flex align-center mt-2">
                  <v-text-field
                    ref="newItemInput"
                    width="250"
                    v-model="newItemName"
                    label="Ajouter un nouvel item"
                    hide-details
                    outlined
                    clearable
                    :loading="kitIsLoading"
                    @keyup.enter="addNewItem()" />
                  <v-btn height="56px" color="primary" :loading="kitIsLoading" @click="addNewItem()">
                    <v-icon icon="mdi-plus" />
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-cols>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
