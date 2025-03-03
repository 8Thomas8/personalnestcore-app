<script setup lang="ts">
const { setToastMessage } = useToastMessage()

const appVersion = ref<string>()

onMounted(async () => {
  try {
    const response = await fetch('/json/version.json')
    const data = await response.json()
    appVersion.value = data.version
  } catch {
    setToastMessage({ message: "Impossible de récupérer la version de l'application", type: 'error' })
  }
})
</script>

<template>
  <span> | App: {{ !appVersion || !appVersion.length ? '?' : appVersion }}</span>
</template>
