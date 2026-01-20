import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils',
    '@nuxt/hints',
    '@nuxt/eslint',
    '@nuxt/icon'
  ],

  ssr: true,

  components: {
    dirs: [
      {
        path: '~/volt',
        global: true
      },
      '~/components'
    ]
  },

  devtools: { enabled: true },

  app: {
    head: {
      title: `Conway's game of life`
    }
  },

  css: ['./app/assets/css/main.css'],

  routeRules: {},

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'bun'
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
