import cookie from 'cookie'

import { Context } from '@nuxt/types'
import { ActionTree } from 'vuex'
import { extractVuexModule } from 'vuex-class-component'
import { v4 as uuid } from 'uuid'
import { BlogStore } from '~/store/blog'
import { AnaliticStore } from '~/store/analitic'
import { BreadcrumbsStore } from '~/store/breadcrumbs'
import { CompareStore } from '~/store/compare'
import { DealsStore } from '~/store/deals'
import { DeviceStore } from '~/store/devices'
import { BackDeviceStore } from '~/store/backDevices'
import { FiltersStore } from '~/store/filters'
import { LayoutStore } from '~/store/layout'
import { LocationStore } from '~/store/location'
import { ProvidersStore } from '~/store/providers'
import { TariffStore } from '~/store/tariff'
import { TvChannelStore } from '~/store/tvChannel'
import { TvPackageStore } from '~/store/tvPackage'
import { ProviderDataStore } from '~/store/providerData'
import { OrdersStore } from '~/store/orders'

export const strict = false

export const modules = ({
  ...extractVuexModule(BreadcrumbsStore),
  ...extractVuexModule(BlogStore),
  ...extractVuexModule(AnaliticStore),
  ...extractVuexModule(CompareStore),
  ...extractVuexModule(FiltersStore),
  ...extractVuexModule(LocationStore),
  ...extractVuexModule(LayoutStore),
  ...extractVuexModule(DealsStore),
  ...extractVuexModule(DeviceStore),
  ...extractVuexModule(BackDeviceStore),
  ...extractVuexModule(ProvidersStore),
  ...extractVuexModule(OrdersStore),
  ...extractVuexModule(TariffStore),
  ...extractVuexModule(TvChannelStore),
  ...extractVuexModule(ProviderDataStore),
  ...extractVuexModule(TvPackageStore)
})

export const state = () => ({
  cookie: {}
})

export type StateType = ReturnType<typeof state>

export const actions: ActionTree<StateType, StateType> = {
  async nuxtServerInit (_, { $vuex, error, req, store }: Context) {
    $vuex.analitic.ChangeUserIP(req.socket.remoteAddress || '')
    const sessionID = cookie.parse(req.headers?.cookie ?? '')?.user_session_id
    if (sessionID) {
      store.state.cookie.user_session_id = cookie.serialize('user_session_id', String(sessionID), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      $vuex.analitic.ChangeUserSessionId(sessionID)
    } else {
      const newCookie = uuid()
      store.state.cookie.user_session_id = cookie.serialize('user_session_id', String(newCookie), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      $vuex.analitic.ChangeUserSessionId(newCookie)
    }

    try {
      const getCookie = req.headers.cookie?.split(';').map(el => el.trim()).find(el => el.includes('earlierSend'))?.split('=') || undefined

      const initActions: Promise<any>[] = [
        $vuex.filters.InitFiltersList(),
        $vuex.tariff.Init(),
        $vuex.providers.Init(),
        $vuex.layout.GetMainPage(),
        $vuex.compare.RestoreFromCookie(req),
        $vuex.analitic.ChangeCookieInfo(getCookie ? getCookie[1] : '')
      ]

      await Promise.all(initActions)
    } catch (e) {
      error({
        statusCode: 500,
        message: e.message
      })
    }
  }
}
