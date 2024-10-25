import { useAuthStore } from '~/store/auth'
import { AuthRoutes, PublicRoutes } from '~/type/routes'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated && to.path === PublicRoutes.Home) {
    return navigateTo(AuthRoutes.App)
  }

  if (!authStore.isAuthenticated && !Object.values(PublicRoutes).includes(to.path as PublicRoutes)) {
    return navigateTo({ path: PublicRoutes.Connexion, query: { from: to.path } })
  }
})
