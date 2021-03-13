<template>
  <div v-if="showThisBlock" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/price.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Стоимость
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <template v-if="showTariffPrice">
          <div class="compareTable__caption">
            Абонентсая плата
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div style="display: flex">
              <div v-for="(tariff) in activeSliders" :key="tariff.id" class="compareTable__content-cell">
                <div class="cost">
                  <span class="cost__value">{{ tariff.price }}</span><span class="cost__period">руб/мес</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showInstall">
          <div class="compareTable__caption">
            Стоимость подключения
          </div>
          <div class="compareTable__content-row compareTable__content-row_flex-end bordered compareTable__content-row_pt4 compareTable__content-row_pb8">
            <div v-for="(tariff, index) in install" :key="index">
              <div class="compareTable__content-cell">
                <div v-if="tariff" class="cost">
                  <span class="cost__value">{{ tariff.value || tariff.value2 }}</span>
                  <span class="cost__period">{{ tariff.units || tariff.units2 }}</span>
                </div>
                <div v-else class="cost">
                  <span class="cost__value">—</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showPrepaidValue">
          <div class="compareTable__caption">
            Авансовый платеж
          </div>
          <div class="compareTable__content-row compareTable__content-row_flex-end bordered compareTable__content-row_pt4 compareTable__content-row_pb10">
            <!-- <VueSlickCarousel
              ref="carouselPrepair"
              v-bind="slickConfig"
            > -->
            <div class="flex">
              <div v-for="(tariff,index) in prepaidValue" :key="index" class="compareTable__content-cell">
                <div v-if="tariff" class="cost">
                  <span class="cost__value">{{ tariff.value || tariff.value2 }}</span>
                  <span class="cost__period">{{ tariff.units || tariff.units2 }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">—</span>
                </div>
              </div>
            </div>
            <!--         </VueSlickCarousel> -->
          </div>
        </template>
        <div>
          <template v-for="(items, name) in devicesCosts">
            <div v-if="showDeviceCost[name]" :key="name + 'title'" class="compareTable__caption">
              {{ name }}
            </div>
            <div v-if="showDeviceCost[name]" :key="name + 'items'" class="compareTable__content-row compareTable__content-row_flex-end compareTable__content-row_pt4 compareTable__content-row_pb6">
              <div class="flex">
                <div v-for="(devices, i) in items" :key="`${i}-devices`" class="compareTable__content-cell">
                  <div v-for="device in devices" :key="device.id" class="cost">
                    <span class="cost__value">{{ device ? deviceBuyOrRent(device).split(' ')[0] : '—' }}</span>
                    <span class="cost__period">{{ device ? deviceBuyOrRent(device).split(' ')[1] : '—' }}</span>
                  </div>
                  <span v-if="!devices.length">
                    —
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import VueSlickCarousel from 'vue-slick-carousel'
import { CompareSlickConfig } from './SlickConfig'
import { DealAttribute, DealDevice, IDealItem } from '~/types/deals'
import { DeviceHelper } from '~/utils/DeviceHelper'
import { CmsDeviceDetail } from '~/types/device'
import { DevicePaymentHelper } from '~/mixins/DevicePaymentHelper'

type Slider = typeof VueSlickCarousel;

export default DevicePaymentHelper.extend({

  computed: {
    slickConfig (): JQuerySlickOptions {
      return CompareSlickConfig()
    },
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    activeSliders (): IDealItem[] {
      return [...this.compareList, ...this.compareList].slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    DeviceHelper: () => DeviceHelper,
    devicesCosts (): Record<string, Array<CmsDeviceDetail & DealDevice>[]> {
      return this.activeSliders.reduce((acc, item, index) => {
        item.device_use.forEach((el) => {
          const device = this.$vuex.device.byId(el.device)!
          const deviceType = DeviceHelper.GetHumanType(device.kind)
          if (!acc[deviceType]) {
            acc[deviceType] = Array(this.activeSliders.length).fill('').map(() => [])
          }
          acc[deviceType][index].push(Object.assign({}, device, el))
        })
        return acc
      }, {} as Record<string, Array<CmsDeviceDetail & DealDevice>[]>)
    },
    install (): (DealAttribute | undefined)[] {
      return this.activeSliders.map(item => item.attributes.find(el => el.key === 'install_payment'))
    },
    showInstall (): boolean {
      return this.install.some(Boolean) && this.install.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && (el?.value || el?.value2) !== (arr[i - 1]?.value || arr[i - 1]?.value2)) ||
        (i !== 0 && (el?.units || el?.units2) !== (arr[i - 1]?.units || arr[i - 1]?.units2))
      })
    },
    showDeviceCost (): Record<string, boolean> {
      return Object.entries(this.devicesCosts).reduce((acc, [key, value]) => {
        acc[key] = value.some(Boolean) && value.some((el, i, arr) => {
          return !this.isComparing || arr.length === 1 || (i !== 0 && (el[0]?.cost) !== (arr[i - 1][0]?.cost))
        })
        return acc
      }, {} as Record<string, boolean>)
    },
    showPayment ():boolean {
      return !this.isComparing
    },
    showThisBlock (): boolean {
      return [
        this.showInstall,
        ...Object.values(this.showDeviceCost),
        this.showPrepaidValue,
        this.showTariffPrice,
        this.showPayment
      ].some(Boolean)
    },
    showTariffPrice (): boolean {
      return this.$vuex.compare.compareList.some(Boolean) && this.$vuex.compare.compareList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.price !== arr[i - 1]?.price)
      })
    },
    prepaidValue (): (DealAttribute | undefined)[] {
      return this.activeSliders.map(item => item.attributes.find(el => el.key === 'prepaid_payment'))
    },
    showPrepaidValue (): boolean {
      return this.prepaidValue.some(Boolean) && this.prepaidValue.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && (el?.value || el?.value2) !== (arr[i - 1]?.value || arr[i - 1]?.value2)) ||
        (i !== 0 && (el?.units || el?.units2) !== (arr[i - 1]?.units || arr[i - 1]?.units2))
      })
    }
  }

})
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>
