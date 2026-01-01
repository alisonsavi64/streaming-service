export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
  ],

  ssr: true,

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://backend:3001',
    },
  },

i18n: {
   strategy: 'no_prefix',
  langDir: 'locales',
  defaultLocale: 'pt',
  locales: [
    { code: 'en', name: 'English', file: 'en.json' },
    { code: 'pt', name: 'Português', file: 'pt.json' }
  ],
}
})