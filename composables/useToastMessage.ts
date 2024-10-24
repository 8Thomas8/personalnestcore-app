import { useStorage } from '@vueuse/core'
import type { ToastMessage } from '~/type/types'
import { ToastMessageType } from '~/type/constants'

export const useToastMessage = () => {
  const toastMessage = useStorage('toastMessage', { type: null, text: null } as ToastMessage)
  const isOpened = useStorage('isOpened', true)

  const setToastMessage = (value?: ToastMessage) => {
    toastMessage.value.type = value?.type ?? ToastMessageType.TypeError
    toastMessage.value.text = value?.text ?? 'Une erreur est survenue'
    isOpened.value = true
  }

  const resetToastMessage = () => {
    isOpened.value = false
    toastMessage.value.type = null
    toastMessage.value.text = null
  }

  return { toastMessage, isOpened, setToastMessage, resetToastMessage }
}
