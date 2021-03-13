<template>
  <div class="card__position">
    <div class="card__position-row">
      <div class="card__position-item">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/tv-accent.svg">
        </div>
        <div class="card__position-content">
          <div class="card__position-volume">
            <div
              class="card__position-volume-value"
              :style="{fontWeight: !isDesktop ? '600' : '500'}"
            >
              {{ channelsCount }}
            </div>
            <div class="card__position-volume-title">
              {{ $plural.n(channelsCount,'канал', 'канала','каналов') }}
            </div>
          </div>
          <div v-if="hdChannelsCount" class="card__position-notice">
            из них {{ hdChannelsCount }} HD
          </div>
        </div>
      </div>
      <div v-if="tvBoxCount > 0 && renderDevices.length && deviceuse !== 'false'" class="card__position-item">
        <div class="card__position-icon">
          <img src="~/assets/images/sprite-svg/tv-devide-accent.svg">
        </div>
        <div class="card__position-content">
          <service-device-label
            v-for="(tvbox, index) in renderDevices"
            :key="index"
            :device="tvbox"
          />
        </div>
      </div>
    </div>
    <transition-expand>
      <div v-if="expanded">
        <div v-if="packageName" class="card__position-data card__position-data_flex card__position-data_packages">
          <div v-if="packageName" class="card__position-data-cell text-gray">
            <div class="card__position-data-title">
              Пакет каналов
            </div>
          </div>
          <div class="card__position-data-cell">
            <div v-if="packageName" class="card__position-data-title card__position-data-title_bold">
              {{ packageName }}
            </div>
          </div>
          <div class="card__position-data-cell">
            <!-- <a class="link link_dotted link_accent">
              <div class="link__icon">
                <img src="~/assets/images/sprite-svg/arrow-right.svg">
              </div>
              <div class="link__text">Все каналы</div>
            </a> -->
          </div>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TransitionExpand from '~/components/utils/TransitionExpand.vue'
import { DealDevice, DealTvPackage, DEAL_SERVICE_TYPE, ServiceTv } from '~/types/deals'
import { TvPackage } from '~/types/tvPackages'

export default Vue.extend({
  components: { TransitionExpand },
  props: {
    item: {
      type: Object as PropType<ServiceTv>,
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
    tariffId: {
      type: Number,
      required: true
    },
    blog: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    deviceuse (): string {
      return this.$vuex.filters.filterValues.tv_box_count as string
    },
    tvBoxCount (): number {
      return Number(this.$vuex.filters.filterValues.tv_box_count as string || 1)
    },
    renderDevices (): DealDevice[] {
      // Get routers
      return this.device.filter(el => el.services.includes(DEAL_SERVICE_TYPE.TV) && el.services.length === 1)
    },
    choosenItem (): DealTvPackage|undefined {
      const selectedPackage = this.$vuex.deals.dealsOptions.dealOptions(this.tariffId)?.tv_package
      return (selectedPackage && this.item.packages_use.find(el => el.package === selectedPackage)) ||
        this.item.packages_use.find(el => el.included) ||
        this.item.packages_use[0]
    },
    channelsCount (): number {
      return this.choosenItem?.channels_count ?? this.item.channels_count ?? 0
    },
    hdChannelsCount (): number {
      return this.choosenItem?.hd_channels_count ?? 0
    },
    selectedPackageData (): TvPackage|undefined {
      return this.$vuex.tvPackage.byId(this.choosenItem?.package ?? 0)
    },
    packageName (): string {
      return this.selectedPackageData?.name ?? ''
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
