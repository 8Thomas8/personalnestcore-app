import { ServiceRoutes } from '~/types/routes'

export const servicesMenu = [
  {
    title: 'Pharmacie',
    icon: 'mdi-medical-cotton-swab',
    to: ServiceRoutes.Pharmacy,
  },
  {
    title: "Consommation d'eau",
    icon: 'mdi-water-pump',
    to: ServiceRoutes.WaterConsumption,
  },
]
