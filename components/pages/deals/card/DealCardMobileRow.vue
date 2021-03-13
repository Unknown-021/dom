<script lang="ts">
import Vue, { PropType } from 'vue'
import { TariffItemRow } from './DealCardMobileDetail.vue'

export default Vue.component('DealCardMobileRow', {
  functional: true,
  props: {
    row: {
      type: Object as PropType<TariffItemRow>,
      required: true
    }
  },
  render (h, { props: { row } }) {
    return h(
      'div',
      {
        class: 'cardItemDetail__property-row'
      },
      [
        h(
          'div',
          {
            class: 'cardItemDetail__property-name'
          },
          [
            row.title,
            !row.subtitle ? undefined : h('div', { class: 'cardItemDetail__property-notice' }, [
              row.subtitle
            ])
          ]
        ),
        h(
          'div',
          {
            class: 'cardItemDetail__property-value'
          },
          [
            String(row.value),
            !row.subvalue ? undefined : h('div', { class: 'cardItemDetail__property-notice' }, [
              row.subvalue
            ])
          ]
        )
      ]
    )
  }
})
</script>

<style lang="scss" scoped>

</style>
