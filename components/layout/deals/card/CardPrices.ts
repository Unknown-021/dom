import Vue, { PropType, VNode, CreateElement } from 'vue'
import { DealDevice, IDealItem } from '~/types/deals'
import TransitionExpand from '~/components/utils/TransitionExpand.vue'
import { DeviceHelper } from '~/utils/DeviceHelper'

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<IDealItem>,
      required: true
    },
    expanded: {
      type: Boolean,
      default: () => true
    },
    calcPrices: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    devicesMap (): Record<DealDevice['device'], { id: DealDevice['device'], count: number }> {
      return this.$vuex.deals.dealsOptions.dealOptions(this.item.id)?.devices ?? {}
    },
    countDevice (): ({ name: string; count: number; } | undefined)[] {
      return this.item.device_use.map((device) => {
        const deviceInfo = this.$vuex.device.byId(device.device)!
        const count = (() => {
          if (!this.calcPrices) {
            return 1
          }
          if (!(device.device in this.devicesMap)) {
            return 0
          }
          return this.devicesMap[device.device].count
        })()

        if (count === 0) {
          return
        }
        const [price] = DeviceHelper.GetPrice(device)
        return { name: DeviceHelper.GetHumanType(deviceInfo?.kind), count: (price * count) }
      })
    }
  },
  watch: {
    countDevice () {
      localStorage.setItem('orderDevice', JSON.stringify(this.countDevice))
    }
  },
  methods: {
    getPrice (h: CreateElement, cost: number|string, isPeriod = false, currency = 'руб', period = 'мес'): VNode[] {
      return [
        h('div', { class: 'card__property-cost-value' }, [String(cost)]),
        h('div', { class: 'card__property-cost-period' }, [
          currency,
          isPeriod && h('span', [period])
        ])
      ]
    }
  },
  render (h): VNode {
    const childs: [VNode|string|(VNode|string)[], VNode|VNode[]|string, boolean][] = []
    if (this.item.price) {
      childs.push([
        'Абонентская плата',
        this.getPrice(h, this.item.price, true),
        false
      ])
    }

    const install = this.item.attributes.find(el => el.key === 'install_payment')
    childs.push([
      'Подключение',
      this.getPrice(h, Number(install?.value ?? 0)),
      true
    ])
    const prepaid = this.item.attributes.find(el => el.key === 'prepaid_payment')
    if (prepaid) {
      childs.push([
        prepaid.name,
        this.getPrice(h, prepaid.value ?? prepaid.value2 ?? '', false, prepaid.units ?? prepaid.units2),
        true
      ])
    }
    const firstMonth = this.item.attributes.find(el => el.key === 'first_month_cost')
    if (firstMonth) {
      childs.push([
        firstMonth.name,
        this.getPrice(h, firstMonth.value ?? '', false),
        true
      ])
    }

    this.item.device_use.forEach((device) => {
      const deviceInfo = this.$vuex.device.byId(device.device)!
      const count = (() => {
        if (!this.calcPrices) {
          return 1
        }
        if (!(device.device in this.devicesMap)) {
          return 0
        }
        return this.devicesMap[device.device].count
      })()
      if (count === 0) {
        return
      }
      const [price, isPeriodic] = DeviceHelper.GetPrice(device)
      childs.push([
        [
          // TODO - HANDLE DEVICE KIND
          DeviceHelper.GetHumanType(deviceInfo?.kind), h('div', { class: 'card__property-notice' },
            [DeviceHelper.GetHumanPayment(device.method)])
        ],
        this.getPrice(
          h,
          price * count,
          isPeriodic
        ),
        false
      ])
    })

    const prices = childs.map(([title, value, isEmpty]) => h(
      'div',
      { class: 'card__property' },
      [
        h('div', { class: 'card__property-title' }, [title]),
        h('div', { class: `card__property-cost ${isEmpty && 'card__property-cost_empty'}` }, [value])
      ]
    ))

    return h('div', { class: 'card__properties' }, [
      h(TransitionExpand, [
        this.expanded && h('div', prices)
      ])
    ])
  }
})
