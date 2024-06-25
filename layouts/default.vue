<script setup lang="ts">
import AuthDialog from '~/components/dialogs/AuthDialog.vue'
import Header from '~/components/commons/Header.vue'
</script>

<template>
  <div>
    <Header />
    <slot />
    <client-only>
      <AuthDialog />
    </client-only>
  </div>
</template>
