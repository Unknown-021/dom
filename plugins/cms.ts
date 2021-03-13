import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $cmsImg(url?: string): string;
    $cmsPhone(numberPhone: string): string;
    $cmsChangeUrl(text: string): string;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cmsImg(text?: string): string
  }
  interface Context {
    $cmsImg(text?: string): string
  }
}

export const cmsImg = (url?: string) => {
  try {
    return !url
      ? require('~/assets/images/errors/error-500.png')
      : (new URL(url, process.env.NUXT_ENV_CMS_URL || window?.location.origin || '')).href
  } catch (e) {
    return ''
  }
}

export const cmsChangeUrl = (text: string): string => {
  return text.replace(/src="(.+?)"/g, (match, p1) => {
    const url = (new URL(p1, process.env.NUXT_ENV_CMS_URL)).pathname
    return match.replace(p1, cmsImg(url))
  })
}
export const cmsPhone = (numberPhone: string) => {
  try {
    return numberPhone === '' ? '' : numberPhone.match(/\d/g)?.join('')
  } catch (e) {
    return ''
  }
}

const cmsPlugin: Plugin = (_ctx, inject) => {
  inject('cmsPhone', cmsPhone)
  inject('cmsImg', cmsImg)
  inject('cmsChangeUrl', cmsChangeUrl)
}

export default cmsPlugin
