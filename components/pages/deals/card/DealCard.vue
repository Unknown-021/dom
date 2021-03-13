<script lang="ts">
import Vue, { PropType } from 'vue'
import Desktop from './DealCardDesktop.vue'
import Mobile from './DealCardMobile.vue'
import { IDealItem } from '~/types/deals'

export default Vue.component('DealCard', {
  functional: true,
  props: {
    item: {
      type: Object as PropType<IDealItem>,
      required: true
    },
    isDesktop: {
      type: Boolean
    }
  },
  render (createElement, { props: { isDesktop, item } }) {
    return createElement(
      isDesktop ? Desktop : Mobile,
      {
        props: { item }
      }
    )
  }
})
</script>
