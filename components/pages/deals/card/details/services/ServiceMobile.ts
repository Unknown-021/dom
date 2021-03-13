import Vue, { PropType } from 'vue'
import TransitionExpandVue from '~/components/utils/TransitionExpand.vue'
import { UNLIMITED_MODILE_TRAFFIC } from '~/consts'
import { DealDevice, ServiceMobile } from '~/types/deals'

export default Vue.component('ServiceMobile', {
  name: 'ServiceMobile',
  functional: true,
  props: {
    item: {
      type: Object as PropType<ServiceMobile>,
      required: true
    },
    device: {
      type: Array as PropType<DealDevice[]>,
      required: true
    },
    expanded: {
      type: Boolean,
      default: () => false
    },
    blog: {
      type: Boolean,
      default: () => false
    }
  },

  render (h, { props: { item, expanded } }) {
    // @ts-expect-error
    const mainData: (string|VNode)[][] = [
      [item.gigabytes === UNLIMITED_MODILE_TRAFFIC ? h('div', { class: ['unlimited'] }, '∞') : item.gigabytes, 'Гб'],
      [item.minutes, 'мин'],
      [item.sms, 'sms']
    ].filter(value => value.every(Boolean))

    if (item.sim_count > 1) {
      mainData.unshift([String(item.sim_count), 'шт'])
    }

    const additionalData: [string, string][] = []

    return h('div', { class: 'card__position' }, [
      h('div', { class: 'card__position-row card__position-row_mobile' }, [
        ...mainData.map(([value, unit], index) => h(
          'div',
          { class: 'card__position-item' },
          [
            index === 0 ? h('div', { class: 'card__position-icon' }, [
              h('img', { attrs: { src: require('~/assets/images/sprite-svg/mobile-accent.svg') } })
            ]) : undefined,
            h('div', { class: 'card__position-content' }, [
              h('div', { class: 'card__position-volume', style: item.gigabytes === UNLIMITED_MODILE_TRAFFIC ? 'align-items: center' : '' }, [
                h('div', { class: 'card__position-volume-value' }, [value]),
                h('div', { class: 'card__position-volume-title', style: item.gigabytes === UNLIMITED_MODILE_TRAFFIC ? 'height: 4px' : '' }, [unit])
              ])
            ])
          ]
        ))
      ]),
      // EXPAND DATA
      h(TransitionExpandVue, [
        (!!additionalData.length && expanded) ? h('div', { class: 'card__position-data card__position-data_flex card__position-data_packages' }, [
          h('div', { class: 'card__position-data-cell text-gray' }, [
            additionalData.map(([title], i) => h(
              'div',
              { class: additionalData.length - 1 === i ? 'card__position-data-title' : 'card__position-data-content' },
              title
            ))
          ]),
          h('div', { class: 'card__position-data-cell' }, [
            ...additionalData.map(([_, text], i) => h(
              'div',
              {
                class: additionalData.length - 1 === i
                  ? 'card__position-data-title card__position-data-title_bold'
                  : 'card__position-data-content card__position-data-content_bold'
              },
              text
            ))
          ])
        ]) : undefined
      ])
    ])
  }
})
