<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue'
import Internet from './ServiceInternet.vue'
import BlogInternet from './BlogServiceInternet.vue'
import Tv from './ServiceTv.vue'
import BlogTv from './BlogServiceTv.vue'
import Mobile from './ServiceMobile'
import CCTV from './ServiceCCTV.vue'
import { DealDevice, DealServiceItem, DEAL_SERVICE_TYPE } from '~/types/deals'

export default Vue.component('DealServiceItemDesktop', {
  functional: true,
  props: {
    item: {
      type: Object as PropType<DealServiceItem>,
      required: true
    },
    device: {
      type: Array as PropType<DealDevice[]>,
      required: true
    },
    techs: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    expanded: {
      type: Boolean,
      default: () => false
    },
    tariffId: {
      type: Number,
      required: true
    },
    isBlog: {
      type: Boolean,
      default: () => false
    }
  },
  render (h, { props }) {
    const component: VueConstructor|undefined = (() => {
      switch (props.item.service_type) {
        case DEAL_SERVICE_TYPE.INTERNET: return props.isBlog ? BlogInternet : Internet
        case DEAL_SERVICE_TYPE.TV: return props.isBlog ? BlogTv : Tv
        case DEAL_SERVICE_TYPE.MOBILE: return props.isBlog ? undefined : Mobile
        case DEAL_SERVICE_TYPE.CCTV: return props.isBlog ? undefined : CCTV
        default: return undefined
      }
    })()

    return h(component, { props })
  }
})
</script>

<style lang="scss" scoped>

</style>
