import Vue from 'vue'
import { action, createModule, createSubModule, mutation } from 'vuex-class-component'
import { DevicePaymentStore } from '~/store/tariffDevicePayment'
import { DeviceTypeStore } from '~/store/tariffDeviceType'
import { ServiceTypeStore } from '~/store/tariffServiceType'
import { DEALS_SORT_TYPES, IDealItem } from '~/types/deals'
import api from '~/api'
import { FilterLocationData } from '~/types/filters'
import { TARIFF_CHECKED_ADDRESS } from '~/types/tariff'

export class TariffStore extends createModule({
  target: 'nuxt',
  namespaced: 'tariff'
}) {
  serviceType = createSubModule(ServiceTypeStore);
  devicePayment = createSubModule(DevicePaymentStore);
  deviceType = createSubModule(DeviceTypeStore);
  public tariffID: number|null = null
  private checkedTarrifs: Record<IDealItem['id'], TARIFF_CHECKED_ADDRESS> = {}

  @action async Init () {
    await Promise.all([
      this.serviceType.Init(),
      this.devicePayment.Init(),
      this.deviceType.Init()
    ])
  }

  @action async GetTariffID (id: number) {
    this.TariffID(id)
  }

  @mutation TariffID (id: number) {
    this.tariffID = id
  }

  @action async CheckTariffAvailable (id: IDealItem['id']) {
    const location: FilterLocationData = this.$store.rootGetters['location/fullLocationState']
    const { results } = await api.deals.GetDealByAddressAndId(location, id)

    const sort: DEALS_SORT_TYPES = this.$store.rootState.filters.sort

    const { count } = await api.deals.GetDeals(
      location,
      [],
      sort, 0, 1
    )
    Vue.set(
      this.checkedTarrifs,
      id,
      results.length > 0
        ? TARIFF_CHECKED_ADDRESS.AVALILABLE
        : (count ? TARIFF_CHECKED_ADDRESS.OTHER_AVALIABLE : TARIFF_CHECKED_ADDRESS.NOT_AVALIABLE)
    )
  }

  get tariffAddressAvailale () {
    return (id: IDealItem['id']) => {
      return this.checkedTarrifs[id] ?? TARIFF_CHECKED_ADDRESS.UNCHECKED
    }
  }
}
