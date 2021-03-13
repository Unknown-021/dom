<script lang="ts">
import Vue, { PropType } from 'vue'
import EquipmentDesktop from './EquipmentCardDesktop.vue'
import EquipmentMobile from './EquipmentCardMobile.vue'
import { IDevice } from '~/types/providers'

export default Vue.component('EquipmentCard', {
  functional: true,
  props: {
    isDesktop: {
      type: Boolean
    },
    item: {
      type: Object as PropType<IDevice>,
      default: () => 0
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  render (h, { props }) {
    return h(
      props.isDesktop ? EquipmentDesktop : EquipmentMobile,
      { props }
    )
  }
})
</script>
