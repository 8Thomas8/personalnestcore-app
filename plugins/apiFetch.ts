import { type CustomError, HttpError } from '~/types/constants'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide(
    'apiFetch',
    async (
      request: string,
      options = {
        headers: {},
      },
    ) => {
      const authStore = useAuthStore()
      const config = useRuntimeConfig()

      try {
        return await $fetch(`${config.public.apiBase}${request}`, {
          ...options,
          headers: {
            Authorization: authStore.isAuthenticated ? `Bearer ${authStore.token}` : '',
            ...options?.headers,
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.response.status === HttpError.Forbidden) {
          await authStore.logout()
        }

        const customError: CustomError = {
          status: error?.response?.status || 500,
          message: error?.response?._data?.message || 'Une erreur inconnue est survenue',
        }

        throw createError(customError)
      }
    },
  )
})
