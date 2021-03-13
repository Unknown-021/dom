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
              <div class="compareTable__content-cell">
                <div v-if="mobileListLeft">
                  <span class="cost__value">
                    {{ mobileListLeft.gigabytes ? '∞' : mobileListLeft.gigabytes }}
                  </span>
                  <span class="cost__period">ГБ</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="mobileListRight">
                  <span class="cost__value">
                    {{ mobileListRight.gigabytes ? '∞' : mobileListRight.gigabytes }}
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
              <div class="compareTable__content-cell">
                <div v-if="mobileListLeft">
                  <span class="cost__value">{{ mobileListLeft.sim_count }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div><div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="mobileListRight">
                  <span class="cost__value">{{ mobileListRight.sim_count }}</span>
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
              <div class="compareTable__content-cell">
                <div v-if="mobileListLeft">
                  <span class="cost__value">{{ mobileListLeft.minutes }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="mobileListRight">
                  <span class="cost__value">{{ mobileListRight.minutes }}</span>
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
              <div class="compareTable__content-cell">
                <div v-if="mobileListLeft">
                  <span class="cost__value">{{ mobileListLeft.sms || '—' }}</span>
                </div>
                <div v-else>
                  <span class="cost__value">{{ '—' }}</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="mobileListRight">
                  <span class="cost__value">{{ mobileListRight.sms || '—' }}</span>
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
    compareList ():IDealItem[] {
      return this.$vuex.compare.compareList
    },
    gigabytes (): number {
      return UNLIMITED_MODILE_TRAFFIC
    },
    mobileListLeft (): (ServiceMobile|undefined) {
      return this.activeSlidersLeft?.services.find(el => el.service_type === DEAL_SERVICE_TYPE.MOBILE) as ServiceMobile
    },
    mobileListRight (): (ServiceMobile|undefined) {
      return this.activeSlidersRight?.services.find(el => el.service_type === DEAL_SERVICE_TYPE.MOBILE) as ServiceMobile
    },
    showSms (): boolean {
      return (Boolean(this.mobileListLeft) || Boolean(this.mobileListRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.mobileListLeft?.sms)) !==
       (JSON.stringify(this.mobileListRight?.sms)) : true)
    },
    showSim (): boolean {
      return (Boolean(this.mobileListLeft) || Boolean(this.mobileListRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.mobileListLeft?.sim_count)) !==
       (JSON.stringify(this.mobileListRight?.sim_count)) : true)
    },
    showMinutes (): boolean {
      return (Boolean(this.mobileListLeft) || Boolean(this.mobileListRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.mobileListLeft?.minutes)) !==
       (JSON.stringify(this.mobileListRight?.minutes)) : true)
    },
    showInternet (): boolean {
      return (Boolean(this.mobileListLeft) || Boolean(this.mobileListRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.mobileListLeft?.gigabytes)) !==
       (JSON.stringify(this.mobileListRight?.gigabytes)) : true)
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
  width: 100%;
}
</style>
