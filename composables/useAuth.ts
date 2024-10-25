import { useStorage } from '@vueuse/core'

export const useAuth = () => {
  const authDialogIsOpened = useStorage('authDialogIsOpened', false)

  const toggleAuthDialog = (value?: boolean) => {
    authDialogIsOpened.value = value ?? !authDialogIsOpened.value
  }

  return {
    toggleAuthDialog,
    authDialogIsOpened,
  }
}
