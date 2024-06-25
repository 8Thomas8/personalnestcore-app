<script lang="ts" setup>
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div>Test</div>
</template>
