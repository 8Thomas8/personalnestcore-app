import { useStorage } from '@vueuse/core'
import { ToastMessageType } from '~/type/constants'

export const useToastMessage = () => {
  const toastMessage = useStorage('toastMessage', '')
  const toastType = useStorage('toastType', '' as ToastMessageType)
  const toastIsOpened = useStorage('toastIsOpened', false)

  const setToastMessage = (type: ToastMessageType, message: string) => {
    toastType.value = type ?? ToastMessageType.TypeError
    toastMessage.value = message ?? 'Une erreur est survenue'
    toastIsOpened.value = true
  }

  const resetToastMessage = () => {
    toastIsOpened.value = false
    toastMessage.value = null
    toastType.value = null
  }

  return { toastMessage, toastType, toastIsOpened, setToastMessage, resetToastMessage }
}
