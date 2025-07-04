<script setup lang="ts">
enum Tabs {
  Pharmacy = 'Pharmacie',
  KitBuilder = 'Kit Builder',
  Container = 'Conteneurs',
  Brands = 'Marques',
  Names = 'Noms',
}

definePageMeta({ layout: 'app' })

const tab = ref(Tabs.Pharmacy)

watch(tab, (newTab) => useHead({ title: newTab }), { immediate: true })
</script>

<template>
  <v-container max-width="1144">
    <v-tabs show-arrows v-model="tab">
      <v-tab :value="Tabs.Pharmacy" prepend-icon="mdi-medical-cotton-swab">Pharmacie</v-tab>
      <v-tab :value="Tabs.KitBuilder" prepend-icon="mdi-toolbox">Kit Builder</v-tab>
      <v-tab :value="Tabs.Container" prepend-icon="mdi-package-variant">Conteneurs</v-tab>
      <v-tab :value="Tabs.Brands" prepend-icon="mdi-tag">Marques</v-tab>
      <v-tab :value="Tabs.Names" prepend-icon=" mdi-format-list-bulleted">Noms</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="Tabs.Pharmacy">
        <Pharmacy />
      </v-window-item>
      <v-window-item :value="Tabs.KitBuilder">
        <KitBuilder />
      </v-window-item>
      <v-window-item :value="Tabs.Container"> <Soon /></v-window-item>
      <v-window-item :value="Tabs.Brands"> <Soon /> </v-window-item>
      <v-window-item :value="Tabs.Names"> <Soon /> </v-window-item>
    </v-window>
  </v-container>
</template>
