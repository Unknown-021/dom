import { Plugin } from '@nuxt/types'
import { noun, verb } from 'plural-ru'

const plural = {
  n: noun,
  v: verb
}

declare module 'vue/types/vue' {
  interface Vue {
    $plural: typeof plural
  }
}

const pluralPlugin: Plugin = (_ctx, inject) => {
  inject('plural', plural)
}

export default pluralPlugin
