<template>
  <div v-if="blockShowDeviceCCTV" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/security-accent.svg" alt="">
        <div class="svg-image-security-accent svg-image-security-accent-dims" />
      </div>
      <div class="compareTable__section-title">
        Видеонаблюдение
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <template v-if="showCCTVNameList">
          <div class="compareTable__caption-title">
            Модель
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb6">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="cctvNameListLeft">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ cctvNameListLeft }}
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="compareTable__equipment-image">
                    <img src="~/assets/images/sprite-svg/not_available.svg" alt="">
                  </div>
                  <div class="compareTable__equipment-title">
                    Приставка не предоставляется
                  </div>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="cctvNameListRight">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ cctvNameListRight }}
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="compareTable__equipment-image">
                    <img src="~/assets/images/sprite-svg/not_available.svg" alt="">
                  </div>
                  <div class="compareTable__equipment-title">
                    Приставка не предоставляется
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showTerm">
          <div class="compareTable__caption-title">
            Условия
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div>
                <div class="compareTable__content-cell">
                  {{ activeSlidersLeft ? devicePrice(activeSlidersLeft) : '—' }}
                </div>
              </div>
            </div>
            <div class="flex">
              <div>
                <div class="compareTable__content-cell">
                  {{ activeSlidersRight ? devicePrice(activeSlidersRight) : '—' }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showCost">
          <div class="compareTable__caption-title">
            Cтоимость
          </div>
          <div class="compareTable__content-row compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div>
                <div class="compareTable__content-cell">
                  {{ activeSlidersLeft ? deviceBuyOrRent(activeSlidersLeft) : '—' }}
                </div>
              </div>
            </div>
            <div class="flex">
              <div>
                <div class="compareTable__content-cell">
                  {{ activeSlidersRight ? deviceBuyOrRent(activeSlidersRight) : '—' }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- <div class="compareTable__content compareTable__content_pb20 compareTable__content_pt12">
      <div class="container">
        <div class="compareTable__content-row compareTable__content-row_flex-center compareTable__content-row_pb4">
          <div v-for="tariff in compareList" :key="tariff.id" class="compareTable__content-cell compareTable__text">
            {{ tariff.id }} дней храненятся записи в облаке
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import { DealDevice, DEAL_SERVICE_TYPE, IDealItem } from '~/types/deals'
import { DevicePaymentHelper } from '~/mixins/DevicePaymentHelper'

export default DevicePaymentHelper.extend({
  computed: {
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    activeSlidersLeft (): DealDevice|undefined {
      return this.compareList[this.swipeNextLeft]?.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.CCTV))
    },
    activeSlidersRight (): (DealDevice | undefined) {
      return this.compareList[this.swipeNextRight]?.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.CCTV))
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    cctvNameListLeft (): string|undefined {
      return this.activeSlidersLeft ? this.$vuex.device.byId(this.activeSlidersLeft?.device)?.Title : this.activeSlidersLeft
    },
    cctvNameListRight (): string|undefined {
      return this.activeSlidersRight ? this.$vuex.device.byId(this.activeSlidersRight.device)?.Title : this.activeSlidersRight
    },
    showCCTVNameList (): boolean {
      return (Boolean(this.activeSlidersLeft) || Boolean(this.activeSlidersRight)) &&
      (this.isComparing ? this.cctvNameListLeft !== this.cctvNameListRight : true)
    },
    showTerm (): boolean {
      return (Boolean(this.activeSlidersLeft) || Boolean(this.activeSlidersRight)) &&
      (this.isComparing ? this.devicePrice(this.activeSlidersLeft) !== this.devicePrice(this.activeSlidersRight) : true)
    },
    showCost (): boolean {
      return (Boolean(this.activeSlidersLeft) || Boolean(this.activeSlidersRight)) &&
      (this.isComparing ? this.devicePrice(this.activeSlidersLeft) !== this.devicePrice(this.activeSlidersRight) : true)
    },
    blockShowDeviceCCTV (): boolean {
      return [
        this.showCCTVNameList,
        this.showCost,
        this.showTerm
      ].some(Boolean)
    }
  }
})
</script>
<style scoped>
.flex {
  width: 100%;
}
</style>
