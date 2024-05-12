<script setup lang="ts">
import AuthDialog from '~/components/dialogs/AuthDialog.vue'
</script>

<template>
  <div>
    <slot />
    <client-only>
      <AuthDialog />
    </client-only>
  </div>
</template>
