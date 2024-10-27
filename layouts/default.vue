<template>
  <div>
    <CommonsAppHeader />

    <v-main>
      <slot />
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>
