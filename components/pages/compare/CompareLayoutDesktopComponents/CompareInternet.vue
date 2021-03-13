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
              <div v-for="(item, index) in speed" :key="index" class="compareTable__content-cell">
                <div v-if="item" class="cost">
                  <span class="cost__value"> {{ item.speed }}</span><span class="cost__period">Мбит/c</span>
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
              <div v-for="(item,index) in technology" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ item }}
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
              <div v-for="(item, index) in models" :key="index" class="compareTable__content-cell">
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
              <div v-for="(item, index) in terms" :key="index" class="compareTable__content-cell">
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
              <div v-for="(item, index) in terms" :key="index" class="compareTable__content-cell">
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
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    activeSliders (): IDealItem[] {
      return [...this.compareList, ...this.compareList].slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    speed (): (ServiceInternet|undefined)[] {
      return this.activeSliders.map(item => item.services.find(el => el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet|undefined)
    },
    showSpeed (): boolean {
      return this.speed.some(Boolean) && this.speed.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.speed !== arr[i - 1]?.speed)
      })
    },
    technology (): (string|undefined)[] {
      const techs = ['FTTB', 'GPON', 'VDSL', 'АDSL']
      return this.activeSliders.map(item => item.technology.find(el => techs.includes(el)))
    },
    showTech (): boolean {
      return this.technology.some(Boolean) && this.technology.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el !== arr[i - 1])
      })
    },
    models (): (string|undefined)[] {
      return this.activeSliders.map(item =>
        item.device_use.find(device =>
          device.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
        )
      )?.map(el => el ? this.$vuex.device.byId(el.device)?.Title : el)
    },
    showModel (): boolean {
      return this.models.some(Boolean) && this.models.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el !== arr[i - 1])
      })
    },
    terms (): (DealDevice | undefined)[] {
      return this.activeSliders.map(item =>
        item.device_use.find(el =>
          el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)
        )
      ).map(item => item)
    },
    showTerms (): boolean {
      return this.terms.some(Boolean) && this.terms.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && this.devicePrice(el) !== this.devicePrice(arr[i - 1]))
      })
    },
    showCost (): boolean {
      return this.terms.some(Boolean) && this.terms.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && this.deviceBuyOrRent(el) !== this.deviceBuyOrRent(arr[i - 1]))
      })
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
  display: flex;
}
</style>
