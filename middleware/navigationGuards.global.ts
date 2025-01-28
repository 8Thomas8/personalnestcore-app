import { useAuthStore } from '~/store/auth'
import { PublicRoutes, ServiceRoutes } from '~/types/routes'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated && to.path === PublicRoutes.Home) {
    return navigateTo(ServiceRoutes.Drugs)
  }

  if (!authStore.isAuthenticated && !Object.values(PublicRoutes).includes(to.path as PublicRoutes)) {
    return navigateTo({ path: PublicRoutes.Connexion, query: { from: to.path } })
  }
})
