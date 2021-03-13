import Vue, { PropType } from 'vue'
import { DealBenefitItem } from '~/types/deals'

export default Vue.component('CardBenefits', {
  name: 'CardBenefits',
  functional: true,
  props: {
    items: {
      type: Array as PropType<DealBenefitItem[]>,
      default: () => []
    }
  },
  render (h, { props: { items } }) {
    if (!items.length) {
      return h()
    }
    return h('ul', [...items].sort((a, b) => a.rate - b.rate).map(el => h('li', el.text)))
  }
})
