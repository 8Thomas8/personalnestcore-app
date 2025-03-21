<script lang="ts" setup>
definePageMeta({ layout: 'app' })

const route = useRoute()
</script>

<template>
  <div>
    <h1>Suivi {{ route.params.slug }}</h1>
  </div>
</template>
