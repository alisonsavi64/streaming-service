export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxt/test-utils/module'
  ],

  ssr: true,

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:3001',
      videoStreamHost: process.env.NUXT_PUBLIC_VIDEO_STREAM_HOST || 'http://localhost:3003'
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