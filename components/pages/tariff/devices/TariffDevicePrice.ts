import Vue, { PropType } from 'vue'
import { DealDevice } from '~/types/deals'

export default Vue.component('TariffDevicePrice', {
  name: 'TariffDevicePrice',
  functional: true,
  props: {
    item: {
      type: Object as PropType<DealDevice>,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  render (h, { props: { item, count } }) {
    const [value, period] = (() => {
      switch (true) {
        // case !!item.cost_norm:
        //   return [
        //     h('span', [
        //       h('stroke', { class: 'old_price' }, String(item.cost_norm! * count)),
        //       `${item.cost! * count}`
        //     ]),
        //     'руб'
        //   ]
        // case !!item.cost:
        // case !!item.single_payment:
        //   return [`${(item.cost || item.single_payment)! * count}`, 'руб']
        case !!item.monthly_payment:
          return [`${item.monthly_payment! * count}`, 'руб/мес']
        default: return ['', '']
      }
    })()
    return h('div', { class: 'cost cost_inline' }, [
      h('div', { class: 'cost__value' }, [value]),
      h('div', { class: 'cost__period' }, [period])
    ])
  }
})
