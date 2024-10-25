import type { ToastMessageType } from '~/type/constants'

export type ToastMessage = {
  type: ToastMessageType
  text: string
}
