<template>
  <div class="card__position">
    <div class="card__position-row">
      <div class="card__position-item" :style="{flexDirection: renderDevices.length && isBlog ? 'column' : 'row'}">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/security-accent.svg">
        </div>
        <div class="card__position-content">
          <span>Видеонаблю&shy;де&shy;ние</span>
          <!-- <div class="card__position-volume">
            <div
              class="card__position-volume-value"
              :style="{fontWeight: !isDesktop ? '600' : '500'}"
            >
              30
            </div>

            <div class="card__position-volume-title">
              дней
            </div>
          </div>
          <div class="card__position-notice">
            хранятся записи в облаке
            <technology-viewer :type="5" :techs="['хранятся записи в облаке']" />
        </div> -->
        </div>
      </div>
      <div v-if="renderDevices.length && deviceuse !== 'false' " class="card__position-item">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/camera-accent.svg">
        </div>
        <div class="card__position-content">
          <service-device-label
            v-for="(router, index) in renderDevices"
            :key="index"
            :device="router"
          />
        </div>
      </div>
    </div>
    <transition-expand>
      <div v-if="expanded">
        <div class="card__position-data">
          Ежемесячный трафик не ограничен
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TransitionExpand from '~/components/utils/TransitionExpand.vue'
import { DealDevice, DEAL_SERVICE_TYPE, ServiceInternet } from '~/types/deals'

export default Vue.extend({
  components: { TransitionExpand },
  props: {
    item: {
      type: Object as PropType<ServiceInternet>,
      required: true
    },
    isBlog: {
      type: Boolean,
      default: false
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
    blog: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    deviceuse (): any {
      return this.$vuex.filters.filterValues.deviceuse__device
    },
    renderDevices (): DealDevice[] {
      // Get routers
      return this.device.filter(el => el.services.includes(DEAL_SERVICE_TYPE.CCTV))
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  }
})
</script>

<style lang="scss" scoped>
.card__position-content span{
  position: relative;
  top: 10px;
}
</style>
