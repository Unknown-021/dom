<template>
  <div class="card__position">
    <div class="card__position-row">
      <div class="card__position-item" :style="{flexDirection: renderDevices ? 'column' : 'row', flexBasis: renderDevices ? '50%' : '100%'}">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/internet-accent.svg">
        </div>
        <div class="card__position-content">
          <div class="card__position-volume">
            <div class="card__position-volume-value">
              {{ item.speed }}
            </div>
            <div class="card__position-volume-title">
              {{ item.units }}
            </div>
          </div>
          <div class="card__position-notice">
            <technology-viewer :type="1" :techs="techs" />
          </div>
        </div>
      </div>
      <div v-if="renderDevices" class="card__position-item">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/wifi-router-accent.svg">
        </div>
        <div class="card__position-content">
          <service-device-label
            :device="renderDevices"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DealDevice, DEAL_SERVICE_TYPE, ServiceInternet } from '~/types/deals'
import TransitionExpand from '~/components/utils/TransitionExpand.vue'

export default Vue.extend({
  // eslint-disable-next-line vue/no-unused-components
  components: { TransitionExpand },
  props: {
    item: {
      type: Object as PropType<ServiceInternet>,
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
    blog: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    renderDevices (): DealDevice|undefined {
      // Get routers
      return this.device.find(el => el.services.includes(DEAL_SERVICE_TYPE.INTERNET))
    }
  }
})
</script>

<style lang="scss" scoped>
.card {
  &__position {
    &-row {
      padding: 0;
    }
    &-item {
      display: flex;
      flex-basis: 50%;
      flex-direction: column;
      align-items: flex-start;
      /* flex: 1; */
    }
    &-icon {
      opacity: 0.3;
    }
    &::after {
      content: none;
    }
    &-volume {
      line-height: 33px;
      &-value {
        font-weight: 600;
      }
    }
  }
}
</style>
