import Vue, { PropType } from 'vue'
import { DEAL_SERVICE_TYPE } from '~/types/deals'

export default Vue.component('TechologyViewer', {
  functional: true,
  props: {
    techs: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    type: {
      type: Number as PropType<DEAL_SERVICE_TYPE>,
      default: () => DEAL_SERVICE_TYPE.UNDEFINED
    }
  },
  render (h, { props }) {
    const title = (() => {
      switch (props.type) {
        case DEAL_SERVICE_TYPE.INTERNET:
          return props.techs.find(el => ['FTTB', 'GPON', 'VDSL', 'АDSL'].includes(el))
        case DEAL_SERVICE_TYPE.TV:
          return props.techs.find(el => ['DOCSIS'].includes(el))
        default: return undefined
      }
    })()

    if (title === undefined) {
      return h()
    }

    const text = ({
      АDSL: 'DSL',
      VDSL: 'DSL',
      GPON: 'Оптика',
      FTTB: 'Оптика'
    } as Record<string, string>)[title]

    return h('span', {
      attrs: {
        title
      }
    }, text)
  }
})
