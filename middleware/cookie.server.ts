import { Middleware } from '@nuxt/types'

const cookieMiddleware: Middleware = ({ res, store }) => {
  res?.setHeader('Set-Cookie', Object.values(store.state.cookie))
  store.state.cookie = {}
}

export default cookieMiddleware
