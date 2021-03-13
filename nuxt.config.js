import './buildGuard'
/**
 * @type {import('@nuxt/types').NuxtConfig}
 */
const config = {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Дом Интернет',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/sass/main.sass',
    'vue-slick-carousel/dist/vue-slick-carousel.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/dayjs',
    '~/plugins/vuex',
    '~/plugins/vue-slick',
    '~/plugins/v-mask',
    '~/plugins/vee-validate',
    '~/plugins/sanitize',
    '~/plugins/plural',
    '~/plugins/intersection.client',
    '~/plugins/regionLink',
    '~/plugins/cms',
    '~/plugins/templateReplacerVars',
    '~/plugins/generateMeta'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/router'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/device',
    '@nuxtjs/gtm',
    '@nuxtjs/redirect-module'
  ],
  redirect: [
    {
      from: '^(\\/[^\\?]*[^\\/])(\\?.*)?$',
      to: '$1/$2'
    }
  ],
  gtm: {
    debug: process.env.NODE_ENV === 'development'
  },
  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
    transpile: [
      'vee-validate',
      '@nuxtjs/device'
    ],
    loaders: {
      imgUrl: {
        limit: false
      }
    },
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  router: {
    middleware: ['address.server', 'metrika.client', 'cookie.server']
  },
  styleResources: {
    scss: [
      './assets/sass/base/_utility.scss'
    ]
  },
  render: {
    compressor: { level: 9 },
    http2: {
      push: true,
      pushAssets: (_req, _res, publicPath, preloadFiles) =>
        preloadFiles
          .filter(f => f.asType === 'script' && f.file === 'runtime.js')
          .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
    },
    bundleRenderer: {
      shouldPreload: (_file, type) => {
        return ['style', /* 'font', */ 'scripts'].includes(type)
      },
      runInNewContext: true
    }
  },
  routerModule: {
    fileName: 'router.ts'
  }
}

export default config
