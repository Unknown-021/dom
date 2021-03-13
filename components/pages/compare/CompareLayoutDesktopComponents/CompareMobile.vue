<template>
  <div v-if="showWholeBlock" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/mobile-accent.svg" alt="">
        <div class="svg-image-mobile-accent svg-image-mobile-accent-dims" />
      </div>
      <div class="compareTable__section-title">
        Мобильная связь
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <template v-if="showInternet">
          <div class="compareTable__caption">
            Интернет
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8 compareTable__content-row_flex-center">
            <div class="flex">
              <div v-for="(item, index) in mobileList" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <span class="cost__value">
                    {{ item.gigabytes ? '∞' : item.gigabytes }}
                  </span>
                  <span class="cost__period">ГБ</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showSim">
          <div class="compareTable__caption">
            SIM-карты
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div v-for="(item, index) in mobileList" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <span class="cost__value">{{ item.sim_count }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showMinutes">
          <div class="compareTable__caption">
            Минуты
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_flex-center">
            <div class="flex">
              <div v-for="(item, index) in mobileList" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <span class="cost__value">{{ item.minutes }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showSms">
          <div class="compareTable__caption">
            SMS
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8 compareTable__content-row_flex-center">
            <div class="flex">
              <div v-for="(item, index) in mobileList" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <span class="cost__value">{{ item.sms || '—' }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
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
import Vue from 'vue'
import { UNLIMITED_MODILE_TRAFFIC } from '~/consts'
import { DEAL_SERVICE_TYPE, IDealItem, ServiceMobile } from '~/types/deals'

export default Vue.extend({
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
    compareList ():IDealItem[] {
      return this.$vuex.compare.compareList
    },
    gigabytes (): number {
      return UNLIMITED_MODILE_TRAFFIC
    },
    mobileList (): (ServiceMobile|undefined)[] {
      return this.activeSliders.map(item => item.services.find(el => el.service_type === DEAL_SERVICE_TYPE.MOBILE) as ServiceMobile)
    },
    showSms (): boolean {
      return this.mobileList.some(Boolean) && this.mobileList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.sms !== arr[i - 1]?.sms)
      })
    },
    showSim (): boolean {
      return this.mobileList.some(Boolean) && this.mobileList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.sim_count !== arr[i - 1]?.sim_count)
      })
    },
    showMinutes (): boolean {
      return this.mobileList.some(Boolean) && this.mobileList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.minutes !== arr[i - 1]?.minutes)
      })
    },
    showInternet (): boolean {
      return this.mobileList.some(Boolean) && this.mobileList.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.gigabytes !== arr[i - 1]?.gigabytes)
      })
    },
    showWholeBlock (): boolean {
      return [
        this.showInternet,
        this.showSim,
        this.showMinutes,
        this.showSms
      ].some(Boolean)
    }
  },
  methods: {
    deviceMobile (devices: DEAL_SERVICE_TYPE[]): boolean {
      return devices.length === 1 && devices.some(el => el === DEAL_SERVICE_TYPE.MOBILE)
    }
  }
})
</script>
<style scoped>
.slick-slide {
  width: 370px;
}
.container {
  overflow: hidden;
}
.flex {
  display: flex;
}
</style>
