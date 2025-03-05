<template>
  <v-footer class="bg-grey-lighten-3">
    <v-row justify="center" no-gutters>
      <v-col class="text-center mt-1" cols="12">
        {{ new Date().getFullYear() }} — <strong>personalnestcore</strong>
      </v-col>
      <v-col class="text-center" cols="12"> <CommonsAppVersion /> | <CommonsApiVersion /> </v-col>
    </v-row>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  max-height: 56px;
}
</style>
<script setup lang="ts"></script>
