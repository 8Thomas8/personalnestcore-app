export type ApiError = {
  message: string
  rule: string
  field: string
  meta: { [key: string]: string | number }
}
