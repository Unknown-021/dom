<template>
  <div class="popularFaq__item">
    <div class="popularFaq__item-toggler" @click="show = !show">
      <div class="popularFaq__item-title">
        <span class="expand-details">Подробнее</span>
      </div>
      <div class="popularFaq__item-icon">
        <img
          :class="['arrow', show ? 'rotated' : '']"
          src="~/assets/images/sprite-svg/arrow-down-accent.svg"
          alt=""
        >
      </div>
    </div>
    <div class="popularFaq__item-content" :class="{ closed: !show }">
      <transition-expand>
        <div v-if="show">
          <slot />
          <hr>
          <div v-if="internetSpeed" class="internet-block">
            <div class="internet-info">
              <div>
                <span class="internet-speed">{{ internetSpeed.speed }}</span>
                <span>Мбит/c</span>
              </div>
              <div class="service-info">
                <span>Оптика</span>
              </div>
            </div>
            <div class="devices">
              <div v-if="getInternetDevice != ''" class="internet-device">
                <span class="internet-device-name">{{ getInternetDevice }}</span>
              </div>
              <div v-if="getCCTVdevice != ''" class="CCTV-device">
                <span class="internet-device-name">{{ getCCTVdevice }}</span>
              </div>
            </div>
          </div>
          <hr v-if="internetSpeed">
          <div v-if="tvPackage " class="tv-block">
            <hr>
            <div class="tv-info">
              <span class="tv-channels">{{ tvPackage.channels_count }}</span>
              <span>{{ $plural.n(tvPackage.channels_count, 'канал', 'каналов') }}</span>
              <div class="service-info">
                <span>из них {{ tvPackage.hd_channels_count }} HD</span>
              </div>
            </div>
            <div v-if="getTVDeviceTitle" class="tv-device">
              <span class="tv-device-name">{{ getTVDeviceTitle }}</span>
            </div>
          </div>
          <hr v-if="tvPackage">
          <div v-if="mobileService" class="mobile-block">
            <div class="mobile-info">
              <span
                v-if="mobileService.gigabytes < 999"
                class="mobile-gigabytes"
              >{{ mobileService.gigabytes }}</span>
              <span v-else class="unlimited mobile-gigabytes">∞</span>
              <span>Гб</span>
            </div>
            <div class="mobile-minutes">
              <span class="mobile-minutes-value">{{
                mobileService.minutes
              }}</span>
              <span>минут</span>
            </div>
            <div v-if="mobileService.sms" class="mobile-sms">
              <span class="mobile-sms-value">{{ mobileService.sms }}</span>
              <span>sms</span>
            </div>
          </div>
          <hr v-if="mobileService">
          <div class="price-block">
            <div class="payment-type">
              <span class="monthly-payment">Абонентская плата</span>
              <span class="connection-price">Стоимость подключения</span>
              <span v-if="routerPrice" class="router-price">Роутер</span>
              <span v-if="tvDevice" class="router-price">ТВ-приставка</span>
            </div>
            <div class="prices-value">
              <span class="price">{{ tariff.price }}</span>
              <span class="price">{{ connectionPrice.value }}</span>
              <span v-if="routerPrice" class="price">{{ routerPrice }}</span>
              <span v-if="tvDevice" class="price">{{ tvDevice.monthly_payment ? tvDevice.monthly_payment : 'Включена в тариф' }}</span>
            </div>
            <div class="price-attribute">
              <span>руб/мес</span>
              <span>{{ connectionPrice.units }}</span>
              <span v-if="routerPrice">руб/мес</span>
              <span v-if="tvDevice">руб/мес</span>
            </div>
          </div>
        </div>
      </transition-expand>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api'
import Vue from 'vue'
import { DealDevice, DealTvPackage, DEAL_SERVICE_TYPE, IDealItem, ServiceInternet, ServiceMobile, ServiceTv } from '~/types/deals'
import { DealOptionsState } from '~/types/dealsOptions'

export default Vue.extend({
  props: {
    tariff: {
      type: Object as PropType<IDealItem>,
      default: null
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    getTariffOptions (): DealOptionsState {
      return JSON.parse(localStorage.getItem('tariffOptions') || '{}')
    },
    internetSpeed (): ServiceInternet | undefined {
      return this.tariff.services.find(item => item.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet | undefined
    },
    device (): any {
      return Object.keys(this.getTariffOptions.devices).map(el => this.$vuex.device.byId(this.getTariffOptions.devices[+el].id))
    },
    routerPrice (): string | number | null {
      let routerPrice: number | null | string = null
      if (this.tariff.device_use.length > 0) {
        this.tariff.device_use.forEach((element) => {
          routerPrice = element.monthly_payment ? element.monthly_payment * this.getTariffOptions.devices[element.device]?.count : 'Включен в тариф'
        })
      }
      return routerPrice
    },
    tvDevice (): DealDevice | undefined {
      let device: DealDevice | undefined
      this.tariff.device_use.forEach((element) => {
        if (element.services[0] === DEAL_SERVICE_TYPE.TV) {
          device = element
          device.monthly_payment = element.monthly_payment ? element.monthly_payment * this.getTariffOptions.devices[element.device]?.count : null
        }
      })
      return device
    },
    tvPackage (): DealTvPackage | undefined {
      const tvPackageID = this.$vuex.deals.dealsOptions.dealOptions(+this.$route.params.id)
      const tvService = this.tariff.services.find(item => item.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv|undefined
      return tvService?.packages_use.find((item: { package: number }) => item.package === tvPackageID?.tv_package)
    },
    mobileService (): ServiceMobile | undefined {
      return this.tariff.services.find(item => item.service_type === DEAL_SERVICE_TYPE.MOBILE) as ServiceMobile | undefined
    },
    getInternetDevice (): string {
      let deviceTitle = ''
      this.tariff.device_use.forEach((element) => {
        if (element.services[0] === DEAL_SERVICE_TYPE.INTERNET) {
          const deviceID = element.device
          const device = this.$vuex.device.byId(deviceID)
          deviceTitle = device?.Title!
        }
      })
      return deviceTitle
    },
    getTVDeviceTitle (): string {
      let deviceTitle = ''
      this.tariff.device_use.forEach((element) => {
        if (element.services[0] === DEAL_SERVICE_TYPE.TV) {
          const deviceID = element.device
          const device = this.$vuex.device.byId(deviceID)
          deviceTitle = device?.Title!
        }
      })
      return deviceTitle
    },
    getCCTVdevice (): string | undefined {
      let deviceTitle = ''
      this.tariff.device_use.forEach((element) => {
        if (element.services[0] === DEAL_SERVICE_TYPE.CCTV) {
          const deviceID = element.device
          const device = this.$vuex.device.byId(deviceID)
          deviceTitle = device?.Title!
        }
      })
      return deviceTitle
    },
    connectionPrice () {
      const connectionPrice = this.tariff.attributes[0]
      const price = {
        value: '0',
        units: 'руб'
      }
      if (connectionPrice !== undefined && connectionPrice.name === 'Стоимость подключения') {
        price.value = connectionPrice.value!
        price.units = connectionPrice.units!
      }
      if (connectionPrice !== undefined && connectionPrice.name === 'Авансовый платёж') {
        price.value = connectionPrice.value2!
        price.units = connectionPrice.units2!
      }
      return price
    }
  }
})
</script>

<style lang="scss" scoped>
.arrow {
  transition: transform 0.4s linear;
  transform-origin: center 30%;

  &.rotated {
    transform: rotate(180deg);
  }
}
.popularFaq__item-content {
  &.closed {
    margin: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
.popularFaq__item-toggler {
  justify-content: end;
  background-color: #fff;
}

.popularFaq__item-icon {
  border: none;
  position: relative;
  left: 70px;
  top: 4px;
}
.service-info {
  width: 242px;
  margin-top: 4px;
}

.service-info span {
  font-family: SF Pro Text;
  font-size: 16px;
  line-height: 20px;
  color: #808080;
}
.devices {
  flex-grow: 2;
}
.expand-details {
  padding-top: 10px;
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #4ba3da;
  border-bottom: 1px dashed #4ba3da;
  width: 95px;
  cursor: pointer;
  position: relative;
  left: 67px;
}

.internet-block,
.tv-block,
.mobile-block {
  display: flex;
  position: relative;
  left: 67px;
  padding-bottom: 20px;
}
.mobile-block {
  justify-content: space-between;
  width: 90%;
}
.internet-speed {
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #000000;
  flex-grow: 3;
}
.internet-info,
.tv-info {
  flex-grow: 1;
}
.internet-device,
.tv-device,
.CCTV-device {
  flex-grow: 2;
}
.internet-speed:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/internet-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 40px;
  top: 31px;
}
.CCTV-device:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/camera-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 40px;
  top: 31px;
}
.mobile-gigabytes:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/mobile-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 40px;
  top: 31px;
}

.internet-device-name,
.tv-device-name {
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  position: relative;
  top: 14px;
}
.mobile-info {
  position: relative;
  top: 10px;
}
.mobile-minutes {
  position: relative;
  top: 40px;
}
.mobile-sms {
  position: relative;
  top: 40px;
}
.mobile-minutes-value,
.mobile-gigabytes,
.mobile-sms-value {
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #000000;
}

.mobile-gigabytes{
  font-family: "SF Pro Text",Verdana,Arial,sans-serif!important;
}
.internet-device:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/wifi-router-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 40px;
  top: 31px;
}
.tv-channels:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/tv-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 41px;
  top: 31px;
}
.tv-device:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/tv-devide-accent.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 41px;
  top: 31px;
}

.tv-channels {
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #000000;
  flex-grow: 3;
}
.mobile-gigabytes {
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 38px;
  line-height: 32px;
  color: #000000;
  flex-grow: 3;
}

.price-block {
  display: flex;
  width: 455px;
  position: relative;
  left: 39px;
}
.price-block:before {
  display: block;
  content: ' ';
  background-image: url('~assets/images/sprite-svg/price.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: relative;
  right: 13px;
  top: 31px;
}
.monthly-payment,
.connection-price,
.router-price {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
}
.monthly-payment,
.connection-price,
.router-price .price {
  padding-right: 10px;
}
.price-attribute,
.payment-type,
.prices-value {
  display: flex;
  flex-direction: column;
}
.prices-value > span {
  padding-top: 12px;
  align-self: flex-end;
  padding-right: 5px;
  font-weight: 600;
}
.price-attribute > span {
  padding-top: 12px;
}
</style>
