<template>
  <v-footer class="bg-grey-lighten-3">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }}
        <v-icon icon="mdi-copyright" size="18" />
        <span class="font-weight-bold">PersonalNestCore</span>
      </v-col>
      <v-col class="text-center" cols="12"> <CommonsAppVersion /> | <CommonsApiVersion /> </v-col>
      <v-col cols="12" class="text-center">
        <v-btn
          prepend-icon="mdi-bug"
          append-icon="mdi-bug"
          variant="text"
          title="Signaler un bug ?"
          href="https://github.com/personalnestcore/personalnestcore-issues"
          target="_blank">
          Signaler un bug ?
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  max-height: 100px;
}
</style>
<script setup lang="ts"></script>
