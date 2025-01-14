import type { ToastMessageType } from '~/types/constants'

export type ToastMessage = {
  type: ToastMessageType
  text: string
}
