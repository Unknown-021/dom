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
              <div v-for="(item, index) in cctvNameList" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ item }}
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
              <div v-for="(item,index) in activeSliders" :key="index" class="compareTable__content-cell">
                {{ item ? devicePrice(item) : '—' }}
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
              <div v-for="(item,index) in activeSliders" :key="index" class="compareTable__content-cell">
                {{ item ? deviceBuyOrRent(item) : '—' }}
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
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    activeSliders (): (DealDevice | undefined)[] {
      return [...this.compareList, ...this.compareList]
        .slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
        .map(item => item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.CCTV)))
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    cctvNameList (): (string|undefined)[] {
      return this.activeSliders.map(item => item ? this.$vuex.device.byId(item.device)?.Title : item)
    },
    showCCTVNameList (): boolean {
      return this.cctvNameList.some(Boolean) && this.cctvNameList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 || (i !== 0 && el !== arr[i - 1])
      })
    },
    showCost (): boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el: DealDevice|undefined, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el && this.deviceBuyOrRent(el) !== this.deviceBuyOrRent(arr[i - 1]))
      })
    },
    showTerm (): boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el: DealDevice|undefined, i, arr) => {
        return !this.isComparing || arr.length === 1 || (i !== 0 && el && this.devicePrice(el) !== this.devicePrice(arr[i - 1]))
      })
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
  display: flex;
}
</style>
