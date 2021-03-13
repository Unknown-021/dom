import Vue from 'vue'
import Router, { RouterOptions } from 'vue-router'

Vue.use(Router)

const scrollBehavior: RouterOptions['scrollBehavior'] = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }
  if (to.hash) {
    const position = { selector: to.hash }
    return position
  }
  if (to.path === from.path) {
    return null
  }
  return { x: 0, y: 0 }
}

/**
 * For each async route component we are use import().then(m => m.default || m)
 * construction cause that code run in babel-tsc and nodejs context with different import systems
 */

export function createRouter () {
  return new Router({
    mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'active-exact',
    scrollBehavior,
    parseQuery: (query) => {
      const out: Record<string, string|string[]> = {}
      const params = new URLSearchParams(query)
      Array.from(params.entries()).forEach(([key, value]) => {
        if (/^\[.+\]$/.test(String(value))) {
          out[key] = String(value).substr(1, value.length - 2).split('|')
        } else {
          out[key] = String(value)
        }
      })
      return out
    },
    stringifyQuery: (query) => {
      const params = new URLSearchParams('')
      Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params.set(
            key,
            `[${value.filter(Boolean).map(String).join('|')}]`
          )
        } else if (value) {
          params.set(key, String(value))
        }
      })
      const string = params.toString()
      return `${string.length ? '?' : ''}${string}`
    },
    routes: [
      /** COMPARE */
      {
        name: 'compare',
        path: '/compare/',
        component: () => import('~/pages/compare.vue').then(m => m.default || m)
      },
      /** SPEEDTEST */
      {
        name: 'speedtest',
        path: '/speedtest/',
        component: () => import('~/pages/speedtest.vue').then(m => m.default || m)
      },
      /** BLOG-PAGE */
      {
        name: 'blog-id',
        path: '/blog/:id/',
        component: () => import('~/pages/blog/_id.vue').then(m => m.default || m)
      },
      /** BLOG-MAIN */
      {
        name: 'blog',
        path: '/blog/',
        component: () => import('~/pages/blog/index.vue').then(m => m.default || m)
      },
      /** ORDER-CHECKOUT */
      {
        name: 'checkout',
        path: '/checkout/:id/',
        component: () => import('~/pages/checkout.vue').then(m => m.default || m)
      },
      /** CITY-TARIFFS-PAGE */
      {
        name: 'tariffs',
        path: '/:city/tariffs/'/* '/:city/:street/:house/' */,
        component: () => import('~/pages/deals.vue').then(m => m.default || m)
      },
      /** PROVIDER-PAGE */
      /* {
        name: 'providers-id',
        path: '/:city/:street?/:house?/providers/:id/',
        component: () => import('~/pages/providers/_id.vue').then(m => m.default || m)
      }, */
      /** TARIFF-PAGE FROM DEALS */
      {
        name: 'tariff-id',
        path: '/:city/:street?/:house?/tariff-:id/',
        component: () => import('~/pages/tariff/_id.vue').then(m => m.default || m)
      },
      /** TARIFF-PAGE FROM TARIFFS */
      {
        name: 'tariffs-id',
        path: '/:city/tariff-:id/',
        component: () => import('~/pages/tariff/_id.vue').then(m => m.default || m)
      },
      /** DEALS-PAGE */
      {
        name: 'deals',
        path: '/:city/:street/:house/',
        component: () => import('~/pages/deals.vue').then(m => m.default || m)
      },
      /** STREET-PAGE */
      {
        name: 'street',
        path: '/:city/:street/',
        component: () => import('~/pages/street.vue').then(m => m.default || m)
      },
      /** MAIN PAGE */
      {
        name: 'index',
        path: '/:city?/',
        component: () => import('~/pages/index.vue').then(m => m.default || m)
      }
    ]
  })
}
