import { Store } from 'vuex'
import { getVuexProxy } from '~/plugins/vuex'
import { CompareSubscribeModule } from '~/subscribes/compare'
import { FilterSubscribeModule } from '~/subscribes/filters'
import { LocationSubscribeModule } from '~/subscribes/location'

export type SubscribeModule = (vuex: ReturnType<typeof getVuexProxy>, store: Store<any>) => void

export const InitSubscribes: SubscribeModule = (vuex, store) => {
  ([
    FilterSubscribeModule,
    CompareSubscribeModule,
    LocationSubscribeModule
  ] as SubscribeModule[]).forEach(fn => fn(vuex, store))
}
