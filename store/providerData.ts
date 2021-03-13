import Vue from 'vue'
import { createModule, action, mutation } from 'vuex-class-component'
import api from '~/api'
import { DEALS_SORT_TYPES, IDealItem } from '~/types/deals'
import { FilterLocationData, FilterOption, TARIFF_PACKET_TYPE } from '~/types/filters'
import { IProvider } from '~/types/providers'
import { PROVIDER_PAGE_TARIFF_TYPES } from '~/consts'
import { TARIFF_CHECKED_ADDRESS } from '~/types/tariff'

export class ProviderDataStore extends createModule({
  target: 'nuxt',
  namespaced: 'providerData'
}) {
    public providerID: IProvider['id'] = 0
    public tariffList: Partial<Record<TARIFF_PACKET_TYPE, IDealItem[]>> = {};
    public existsMoreItems: Partial<Record<TARIFF_PACKET_TYPE, boolean>> = {};
    private checkedProviders: Record<IDealItem['id'], TARIFF_CHECKED_ADDRESS> = {}

    @action async InitProviderState (id: IProvider['id']) {
      if (id === this.providerID) {
        return
      }
      this.CLEAR_STATE()
      this.providerID = id

      const tariffsPromises = Object.keys(PROVIDER_PAGE_TARIFF_TYPES)
        .map(key => this.GetTariffList({ type: Number(key) }))

      await Promise.all(tariffsPromises)
    }

    @action async GetTariffList ({ type, offset = 0 }: { type: TARIFF_PACKET_TYPE, offset?: number }) {
      const location: FilterLocationData = this.$store.rootGetters['location/fullLocationState']
      const filters: FilterOption[] = [
        {
          id: 'provider',
          name: 'Провайдеры',
          type: 'checkbox_image',
          sort: 0,
          value: [this.providerID],
          variants: []
        },
        {
          id: 'service__service_type',
          name: 'Тип',
          type: 'radio',
          sort: 0,
          value: type,
          variants: []
        }
      ]

      const { results, exists_more } = await api.deals.GetDeals(
        location,
        filters,
        this.$store.rootState.filters.sort,
        offset,
        3
      )

      this.AddTariffList({ type, items: results })
      this.ChangeTariffExistsMore({ type, exists_more })
    }

    @action async LoadMore (type: TARIFF_PACKET_TYPE) {
      return this.GetTariffList({ type, offset: this.tariffList[type]?.length || 0 })
    }

    @action async CheckProviderAvailable (id: IDealItem['id']) {
      const location: FilterLocationData = this.$store.rootGetters['location/fullLocationState']
      const { results } = await api.deals.GetProviderByAddressAndId(location, id)

      const sort: DEALS_SORT_TYPES = this.$store.rootState.filters.sort

      const { count } = await api.deals.GetDeals(location,
        [],
        sort, 0, 1)
      Vue.set(
        this.checkedProviders,
        id,
        results.length > 0
          ? TARIFF_CHECKED_ADDRESS.AVALILABLE
          : (count ? TARIFF_CHECKED_ADDRESS.OTHER_AVALIABLE : TARIFF_CHECKED_ADDRESS.NOT_AVALIABLE)
      )
    }

    get providersAddressAvailale () {
      return (id: IDealItem['id']) => {
        return this.checkedProviders[id] ?? TARIFF_CHECKED_ADDRESS.UNCHECKED
      }
    }

    @mutation AddTariffList ({ type, items }: { type: TARIFF_PACKET_TYPE, items: IDealItem[] }) {
      if (type in this.tariffList) {
        this.tariffList[type]?.push(...items)
      } else {
        Vue.set(this.tariffList, type, [...items])
      }
    }

    @mutation ChangeTariffExistsMore ({ type, exists_more }: { type: TARIFF_PACKET_TYPE, exists_more: boolean }) {
      if (type in this.existsMoreItems) {
        this.existsMoreItems[type] = exists_more
      } else {
        Vue.set(this.existsMoreItems, type, exists_more)
      }
    }

    @mutation CLEAR_STATE () {
      this.providerID = 0
      this.tariffList = {}
      this.existsMoreItems = {}
    }

    get loadingTariffList () {
      return this.tariffList
    }
}
