<template>
  <div v-if="showWholeBlock" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/internet-accent.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Интернет
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <template v-if="showSpeed">
          <div class="compareTable__caption">
            Скорость
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="speedLeft" class="cost">
                  <span class="cost__value"> {{ speedLeft.speed }}</span><span class="cost__period">Мбит/c</span>
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="speedRight" class="cost">
                  <span class="cost__value"> {{ speedRight.speed }}</span><span class="cost__period">Мбит/c</span>
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showTech">
          <div class="compareTable__caption">
            Технология подключения
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt8 compareTable__content-row_pb8">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="technologyLeft">
                  {{ technologyLeft }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="technologyRight">
                  {{ technologyRight }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showModel">
          <div class="compareTable__caption">
            Роутер
          </div>
          <div class="compareTable__caption-title">
            Модель
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb6">
            <div class="flex">
              <div v-for="(item, index) in modelsLeft" :key="index" class="compareTable__content-cell">
                <div class="compareTable__equipment">
                  <div v-if="item">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-15.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ item }}
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
              <div v-if="!modelsLeft.length">
                <div class="compareTable__equipment-image">
                  <img src="~/assets/images/sprite-svg/not_available.svg" alt="">
                </div>
                <div class="compareTable__equipment-title">
                  Приставка не предоставляется
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-for="(item, index) in modelsRight" :key="index" class="compareTable__content-cell">
                <div class="compareTable__equipment">
                  <div v-if="item">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-15.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ item }}
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
          </div>
        </template>
        <template v-if="showTerms">
          <div class="compareTable__caption-title">
            Условия
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb6">
            <div class="flex">
              <div v-for="(item, index) in termsLeft" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ devicePrice(item) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-for="(item, index) in termsRight" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ devicePrice(item) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showCost">
          <div class="compareTable__caption-title">
            Cтоимость
          </div>
          <div class="compareTable__content-row compareTable__content-row_pt6">
            <div class="flex">
              <div v-for="(item, index) in termsLeft" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ deviceBuyOrRent(item) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-for="(item, index) in termsRight" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ deviceBuyOrRent(item) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DealDevice, DEAL_SERVICE_TYPE, IDealItem, ServiceInternet } from '~/types/deals'
import { DevicePaymentHelper } from '~/mixins/DevicePaymentHelper'

export default DevicePaymentHelper.extend({
  computed: {
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    activeSlidersLeft (): IDealItem {
      return this.compareList[this.swipeNextLeft]
    },
    activeSlidersRight (): IDealItem {
      return this.compareList[this.swipeNextRight]
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    speedLeft (): ServiceInternet {
      return this.activeSlidersLeft?.services.find(el => el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet
    },
    speedRight (): ServiceInternet {
      return this.activeSlidersRight?.services.find(el => el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet
    },
    showSpeed (): boolean {
      return (this.speedLeft || this.speedRight) &&
        (this.isComparing ? JSON.stringify(this.speedLeft) !== JSON.stringify(this.speedRight) : true)
    },
    technologyLeft (): string|undefined {
      const techs = ['FTTB', 'GPON', 'VDSL', 'АDSL']
      return this.activeSlidersLeft?.technology.find(el => techs.includes(el))
    },
    technologyRight (): string|undefined {
      const techs = ['FTTB', 'GPON', 'VDSL', 'АDSL']
      return this.activeSlidersRight?.technology.find(el => techs.includes(el))
    },
    showTech (): boolean {
      return (Boolean(this.technologyLeft) || Boolean(this.technologyRight)) &&
        (this.isComparing ? JSON.stringify(this.technologyLeft) !== JSON.stringify(this.technologyRight) : true)
    },
    modelsLeft (): (string|undefined)[] {
      return this.activeSlidersLeft?.device_use.filter(device =>
        device.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
      )?.map(el => el ? this.$vuex.device.byId(el.device)?.Title : el)
    },
    modelsRight (): (string|undefined)[] {
      return this.activeSlidersRight?.device_use.filter(device =>
        device.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
      )?.map(el => el ? this.$vuex.device.byId(el.device)?.Title : el)
    },
    showModel (): boolean {
      return (this.modelsLeft || this.modelsRight) &&
        (this.isComparing ? JSON.stringify(this.modelsLeft) !== JSON.stringify(this.modelsRight) : true)
    },
    termsLeft (): (DealDevice | undefined)[] {
      return this.activeSlidersLeft?.device_use.filter(el =>
        el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
      ).map(item => item)
    },
    termsRight (): (DealDevice | undefined)[] {
      return this.activeSlidersRight?.device_use.filter(el =>
        el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
      ).map(item => item)
    },
    showTerms (): boolean {
      return (Boolean(this.termsLeft) || Boolean(this.termsRight)) &&
        (this.isComparing
          ? JSON.stringify(this.termsLeft.map(el => this.devicePrice(el))) !==
        JSON.stringify(this.termsRight.map(el => this.devicePrice(el))) : true)
    },
    showCost (): boolean {
      return (Boolean(this.termsLeft) || Boolean(this.technologyRight)) &&
        (this.isComparing
          ? JSON.stringify(this.termsLeft.map(el => this.deviceBuyOrRent(el))) !==
        JSON.stringify(this.termsRight.map(el => this.deviceBuyOrRent(el))) : true)
    },
    showWholeBlock (): boolean {
      return [
        this.showSpeed,
        this.showTech,
        this.showModel,
        this.showCost,
        this.showTerms
      ].some(Boolean)
    }
  }
})
</script>
<style lang="scss" scoped>
.slick-slide {
  width: 370px;
}
.flex {
  width: 100%;
}
</style>
