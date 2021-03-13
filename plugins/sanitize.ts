import sanitize from 'sanitize-html'
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $sanitize: typeof sanitize
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $sanitize: typeof sanitize
  }
  interface Context {
    $sanitize: typeof sanitize
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $sanitize: typeof sanitize
  }
}

const sanitizePlugin: Plugin = (_context, inject) => {
  inject('sanitize', sanitize)
}

export default sanitizePlugin
