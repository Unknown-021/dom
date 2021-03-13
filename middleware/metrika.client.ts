import { Middleware } from '@nuxt/types'

const metricaMiddleware: Middleware = ({ from, route }) => {
  if (from?.name !== route.name) {
    try {
      window.ym(parseInt(process.env.YANDEX_METRICA_ID ?? ''), 'hit', new URL(route.path, location.origin).href)
    } catch (e) {
      //
    }
  }
}

export default metricaMiddleware
