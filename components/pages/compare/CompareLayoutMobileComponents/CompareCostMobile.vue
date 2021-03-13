<template v-if="showThisBlock">
  <div class="compareTable__section">
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
            <div class="flex">
              <div v-for="(tariff) in activeSlidersLeft" :key="tariff.id" class="compareTable__content-cell">
                <div class="cost">
                  <span class="cost__value">{{ tariff.price }}</span><span class="cost__period">руб/мес</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-for="(tariff) in activeSlidersRight" :key="tariff.id" class="compareTable__content-cell">
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
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="installLeft" class="cost">
                  <span class="cost__value">{{ installLeft.value || installLeft.value2 }}</span>
                  <span class="cost__period">{{ installLeft.units || installLeft.units2 }}</span>
                </div>
                <div v-else class="cost">
                  <span class="cost__value">—</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="installRight" class="cost">
                  <span class="cost__value">{{ installRight.value || installRight.value2 }}</span>
                  <span class="cost__period">{{ installRight.units || installRight.units2 }}</span>
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
            <div class="flex">
              <div v-for="(tariff,index) in prepaidValueLeft" :key="index" class="compareTable__content-cell">
                <div v-if="tariff" class="cost">
                  <span class="cost__value">{{ tariff.value || tariff.value2 }}</span>
                  <span class="cost__period">{{ tariff.units || tariff.units2 }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">—</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-for="(tariff,index) in prepaidValueRight" :key="index" class="compareTable__content-cell">
                <div v-if="tariff" class="cost">
                  <span class="cost__value">{{ tariff.value || tariff.value2 }}</span>
                  <span class="cost__period">{{ tariff.units || tariff.units2 }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">—</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div>
          <template v-for="name in devicesCostsCategories">
            <div :key="name + 'title'" class="compareTable__caption">
              {{ name }}
            </div>
            <div :key="name + 'items'" class="compareTable__content-row compareTable__content-row_flex-end compareTable__content-row_pt4 compareTable__content-row_pb6">
              <div class="flex">
                <div class="compareTable__content-cell">
                  <span v-if="!devicesCostsLeft[name] || !devicesCostsLeft[name].length">
                    —
                  </span>
                  <div v-for="device in devicesCostsLeft[name]" v-else :key="device.id" class="cost">
                    <span class="cost__value">{{ device ? deviceBuyOrRent(device).split(' ')[0] : '—' }}</span>
                    <span class="cost__period">{{ device ? deviceBuyOrRent(device).split(' ')[1] : '—' }}</span>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="compareTable__content-cell">
                  <span v-if="!devicesCostsRight[name] || !devicesCostsRight[name].length">
                    —
                  </span>
                  <div v-for="device in devicesCostsRight[name]" :key="device.id" class="cost">
                    <span class="cost__value">{{ device ? deviceBuyOrRent(device).split(' ')[0] : '—' }}</span>
                    <span class="cost__period">{{ device ? deviceBuyOrRent(device).split(' ')[1] : '—' }}</span>
                  </div>
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
import { DealAttribute, DealDevice, IDealItem } from '~/types/deals'
import { DeviceHelper } from '~/utils/DeviceHelper'
import { CmsDeviceDetail } from '~/types/device'
import { DevicePaymentHelper } from '~/mixins/DevicePaymentHelper'

export default DevicePaymentHelper.extend({
  computed: {
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    activeSlidersLeft (): IDealItem[] {
      return [...this.compareList, ...this.compareList]?.slice(this.swipeNextLeft, this.swipeNextLeft + Math.min(this.compareList.length, 1))
    },
    activeSlidersRight (): IDealItem[] {
      return [...this.compareList, ...this.compareList]?.slice(this.swipeNextRight, this.swipeNextRight + Math.min(this.compareList.length, 1))
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    DeviceHelper: () => DeviceHelper,
    devicesCostsLeft (): Record<string, Array<CmsDeviceDetail & DealDevice>> {
      return this.compareList[this.swipeNextLeft]?.device_use.reduce((acc, el) => {
        const device = this.$vuex.device.byId(el.device)!
        const deviceType = DeviceHelper.GetHumanType(device.kind)
        if (!acc[deviceType]) {
          acc[deviceType] = []
        }
        acc[deviceType]?.push(Object.assign({}, device, el))
        return acc
      }, {} as Record<string, Array<CmsDeviceDetail & DealDevice>>) || {}
    },
    devicesCostsRight (): Record<string, Array<CmsDeviceDetail & DealDevice>> {
      return this.compareList[this.swipeNextRight]?.device_use.reduce((acc, el) => {
        const device = this.$vuex.device.byId(el.device)!
        const deviceType = DeviceHelper.GetHumanType(device.kind)
        if (!acc[deviceType]) {
          acc[deviceType] = []
        }
        acc[deviceType]?.push(Object.assign({}, device, el))
        return acc
      }, {} as Record<string, Array<CmsDeviceDetail & DealDevice>>) || {}
    },
    devicesCostsCategories (): string[] {
      return [
        ...Object.keys(this.devicesCostsLeft),
        ...Object.keys(this.devicesCostsRight)
      ]?.filter((el, idx, arr) => arr.indexOf(el) === idx)
    },
    installLeft (): (DealAttribute | undefined) {
      return this.activeSlidersLeft[0]?.attributes.find(el => el.key === 'install_payment')
    },
    installRight (): (DealAttribute | undefined) {
      return this.activeSlidersRight[0]?.attributes.find(el => el.key === 'install_payment')
    },
    showInstall (): boolean {
      return (Boolean(this.installLeft) || Boolean(this.installRight)) &&
      (this.isComparing ? ((this.installLeft?.value || this.installLeft?.value2) !==
        (this.installRight?.value || this.installRight?.value2)) : true)
    },
    showDeviceCost ()/* : Record<string, boolean> */ {
      /*  Object.entries(this.devicesCostsLeft).reduce((acc, [key, value]) => {
        acc[key] = value.some(Boolean) && value.some((el, i, arr) => {
          return !this.isComparing || arr.length === 1 || (i !== 0 && (el[0]?.cost) !== (arr[i - 1][0]?.cost))
        })
        return acc
      }, {} as Record<string, boolean>) */
    },
    showPayment ():boolean {
      return !this.isComparing
    },
    showThisBlock (): boolean {
      return [
        this.showInstall,
        /* ...Object.values(this.showDeviceCost), */
        this.showPrepaidValue,
        this.showTariffPrice,
        this.showPayment
      ].some(Boolean)
    },
    showTariffPrice (): boolean {
      return (Boolean(this.activeSlidersLeft) ||
      Boolean(this.activeSlidersRight)) &&
       (this.isComparing ? (JSON.stringify(this.activeSlidersLeft)) !==
       (JSON.stringify(this.activeSlidersRight)) : true)
    },
    prepaidValueLeft (): (DealAttribute | undefined)[] {
      return this.activeSlidersLeft?.map(item => item.attributes.find(el => el.key === 'prepaid_payment'))
    },
    prepaidValueRight (): (DealAttribute | undefined)[] {
      return this.activeSlidersRight.map(item => item.attributes.find(el => el.key === 'prepaid_payment'))
    },
    showPrepaidValue (): boolean {
      return (Boolean(this.prepaidValueLeft) ||
      Boolean(this.prepaidValueRight)) &&
       (this.isComparing ? (JSON.stringify(this.prepaidValueLeft)) !==
       (JSON.stringify(this.prepaidValueRight)) : true)
    }
  }

})
</script>
<style lang="scss" scoped>
.flex {
  width: 100%;
}
</style>
