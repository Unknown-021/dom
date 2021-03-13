
import Vue, { PropType } from 'vue'
import { DEAL_ATTRIBUTE_TYPES } from '~/consts'
import { DealAttribute } from '~/types/deals'

export default Vue.component('CardFeatures', {
  name: 'CardFeatures',
  functional: true,
  props: {
    items: {
      type: Array as PropType<DealAttribute[]>,
      default: () => []
    }
  },
  render (h, { props }) {
    const renderAtrributes = props.items
      .filter(el => DEAL_ATTRIBUTE_TYPES.FEATURES.includes(el.key))
      .sort((a, b) => a.rate - b.rate)
    if (!renderAtrributes.length) {
      return h()
    }
    return h('div', { class: 'card__features' }, renderAtrributes.map(el => h(
      'div',
      { class: 'card__feature' },
      [
        el.name,
        (el.value || el.value2) && h('span', { class: 'accent' }, ` ${el.value ?? el.value2 ?? ''} `),
        (el.units || el.units2 || undefined)
      ]
    ))
    )
  }
})
