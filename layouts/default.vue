<template>
  <div>
    <CommonsAppHeader />

    <v-main class="flex-grow-1">
      <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
