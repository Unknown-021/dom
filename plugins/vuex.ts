import { Store } from 'vuex'
import { Plugin } from '@nuxt/types'
import { createProxy } from 'vuex-class-component'
import { VuexModule } from 'vuex-class-component/dist/interfaces'
import { InitSubscribes } from '~/subscribes'
import api from '~/api'
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
import { DealsLabelsStore } from '~/store/dealsLabels'
import { DealsOptionsStore } from '~/store/dealsOptions'
import { CitiesStore } from '~/store/locationCities'
import { RegionsStore } from '~/store/locationRegions'
import { DevicePaymentStore } from '~/store/tariffDevicePayment'
import { DeviceTypeStore } from '~/store/tariffDeviceType'
import { ServiceTypeStore } from '~/store/tariffServiceType'
import { FiltersChangedStore } from '~/store/filtersChanged'

declare module 'vue/types/vue' {
  interface Vue {
    $vuex: ReturnType<typeof getVuexProxy>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vuex: ReturnType<typeof getVuexProxy>
  }
  interface Context {
    $vuex: ReturnType<typeof getVuexProxy>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    rootGetters: Record<string, any>;
    rootState: ReturnType<typeof getVuexProxy>;
  }
}

export function getVuexProxy (store: Store<any>) {
  // Хакаем неудачную либу. Под капотом VuexModule создает "кеш" синглтона, из-за этого у нас шарится состояние между запросами. Чистим
  ([
    AnaliticStore, BackDeviceStore, BlogStore, BreadcrumbsStore, CitiesStore, CompareStore, DealsLabelsStore, DealsOptionsStore, DealsStore, DevicePaymentStore, DeviceStore, DeviceTypeStore, FiltersStore, FiltersChangedStore, LayoutStore, LocationStore, OrdersStore, ProviderDataStore, ProvidersStore, RegionsStore, ServiceTypeStore, TariffStore, TvChannelStore, TvPackageStore
  ] as Array<typeof VuexModule>).forEach((vuexClass) => {
    // @ts-ignore
    delete vuexClass.prototype.__vuex_proxy_cache__
  })
  return {
    breadcrumbs: createProxy(store, BreadcrumbsStore),
    blog: createProxy(store, BlogStore),
    analitic: createProxy(store, AnaliticStore),
    compare: createProxy(store, CompareStore),
    deals: createProxy(store, DealsStore),
    device: createProxy(store, DeviceStore),
    backDevice: createProxy(store, BackDeviceStore),
    filters: createProxy(store, FiltersStore),
    layout: createProxy(store, LayoutStore),
    location: createProxy(store, LocationStore),
    orders: createProxy(store, OrdersStore),
    providers: createProxy(store, ProvidersStore),
    tariff: createProxy(store, TariffStore),
    providerData: createProxy(store, ProviderDataStore),
    tvChannel: createProxy(store, TvChannelStore),
    tvPackage: createProxy(store, TvPackageStore)
  }
}

const vuexPlugin: Plugin = ({ store }, inject) => {
  const vuex = getVuexProxy(store)

  api.setVuex(vuex)

  InitSubscribes(vuex, store)

  inject('vuex', vuex)
}

export default vuexPlugin
