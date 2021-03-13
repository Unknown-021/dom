import Vue, { Component, PropType } from 'vue'
import Internet from './TariffDealInternet.vue'
import Tv from './TariffDealTv.vue'
import Mobile from './TariffDealMobile.vue'
import CCTV from './TariffCCTV.vue'
import { DealServiceItem, DEAL_SERVICE_TYPE, IDealItem } from '~/types/deals'

export default Vue.component('TariffDeal', {
  functional: true,
  props: {
    item: {
      type: Object as PropType<DealServiceItem>,
      required: true
    },
    tariff: {
      type: Object as PropType<IDealItem>,
      required: true
    }
  },
  render (h, ctx) {
    const component: Component<any>|undefined = (() => {
      switch (ctx.props.item.service_type) {
        case DEAL_SERVICE_TYPE.INTERNET: return Internet
        case DEAL_SERVICE_TYPE.TV: return Tv
        case DEAL_SERVICE_TYPE.MOBILE: return Mobile
        case DEAL_SERVICE_TYPE.CCTV: return CCTV
      }
    })()

    return h(component, ctx)
  }
})
