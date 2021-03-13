import Vue, { PropType } from 'vue'
import { TvChannel } from '~/types/tvPackages'

export default Vue.component('TvChannelItem', {
  name: 'TvChannelItem',
  functional: true,
  props: {
    item: {
      type: Object as PropType<TvChannel>,
      required: true
    }
  },
  render (h, { props: { item } }) {
    return h('div', { class: 'tvPackage__channels-item' }, [
      item.logo && h('div', { class: 'tvPackage__channels-thumb' }, [h('img', { attrs: { src: item.logo } })]),
      h('div', { class: 'tvPackage__channels-title' }, item.name)
    ])
  }
})
