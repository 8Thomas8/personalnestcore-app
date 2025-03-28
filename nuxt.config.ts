// https://nuxt.com/docs/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [{ path: '~/components', pathPrefix: false }],
  build: { transpile: ['reflect-metadata', 'vuetify'] },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins = config.plugins || []
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  vite: {
    vue: { template: { transformAssetUrls } },
    esbuild: { tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } },
  },
  compatibilityDate: '2024-09-27',
  runtimeConfig: {
    public: {
      apiBase: '',
      github: {
        projectOwner: '',
        projectAppRepo: '',
        projectApiRepo: '',
      },
      notify: {
        devVersion: '',
      },
    },
  },
})
