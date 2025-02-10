<template>
  <v-footer class="bg-grey-lighten-3">
    <v-row justify="center" no-gutters>
      <v-col class="text-center mt-1" cols="12">
        {{ new Date().getFullYear() }} — <strong>PersonalNestCore</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  max-height: 56px;
}
</style>
