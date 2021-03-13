<template>
  <div v-if="showWholeBlock" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/tv-accent.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Телевидение
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <template v-if="showChanel">
          <div class="compareTable__caption">
            Каналы
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt8 compareTable__content-row_pb6">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="infoAboutChanelLeft">
                  <span class="cost__value">{{ infoAboutChanelLeft.channels_count }}</span>
                  <span>каналов</span>
                </div>
                <div v-else>
                  <span class="cost__value">0</span>
                  <span>каналов</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="infoAboutChanelRight">
                  <span class="cost__value">{{ infoAboutChanelRight.channels_count }}</span>
                  <span>каналов</span>
                </div>
                <div v-else>
                  <span class="cost__value">0</span>
                  <span>каналов</span>
                </div>
              </div>
            </div>
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt8 compareTable__content-row_pb6">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="infoAboutChanelLeft">
                  <span class="cost__value">
                    {{ infoAboutChanelLeft.hd_channels_count || '0 HD' }}
                  </span>
                  <span v-if="infoAboutChanelLeft.hd_channels_count"> HD-каналов</span>
                </div>
                <div v-else>
                  <span class="cost__value">0</span>
                  <span> HD-каналов</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="infoAboutChanelRight">
                  <span class="cost__value">
                    {{ infoAboutChanelRight.hd_channels_count || '0 HD' }}
                  </span>
                  <span v-if="infoAboutChanelRight.hd_channels_count"> HD-каналов</span>
                </div>
                <div v-else>
                  <span class="cost__value">0</span>
                  <span> HD-каналов</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!--  <div class="compareTable__content-row compareTable__content-row_pt6 compareTable__content-row_pb4">
          <div class="compareTable__content-cell">
            <div class="compareTable__channels-list">
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-27.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Nickelodeon
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-28.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  НТВ
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-29.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Первый канал
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-30.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Россия 24
                </div>
              </div>
              <div class="compareTable__channels-listMore">
                <a class="link link_dotted link_accent" href="#">
                  <div class="link__text">Все каналы</div>
                </a>
              </div>
            </div>
          </div>
          <div class="compareTable__content-cell">
            <div class="compareTable__channels-list">
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-27.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Nickelodeon
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-28.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  НТВ
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-29.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Первый канал
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-30.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Россия 24
                </div>
              </div>
            </div>
          </div>
          <div class="compareTable__content-cell">
            <div class="compareTable__channels-list">
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-27.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  Nickelodeon
                </div>
              </div>
              <div class="compareTable__channels-item">
                <div class="compareTable__channels-icon">
                  <img src="~/assets/images/tmp/img-28.jpg" alt="">
                </div>
                <div class="compareTable__channels-title">
                  НТВ
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <template v-if="showTvPackage">
          <div class="compareTable__caption">
            Пакет каналов
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt8 compareTable__content-row_pb6">
            <div class="flex">
              <div class="compareTable__content-cell">
                <span v-if="tvPackageLeft">
                  {{ tvPackageLeft }}
                </span>
                <span v-else>—</span>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <span v-if="tvPackageRight">
                  {{ tvPackageRight }}
                </span>
                <span v-else>—</span>
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="compareTable__caption">
          Подписки
        </div>
        <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb4">
          <div class="compareTable__content-cell">
            Ivi, Wink
          </div>
          <div class="compareTable__content-cell">
            Okk,Kinopoisk
          </div>
        </div> -->
        <template v-if="showTvDevice">
          <div class="compareTable__caption">
            ТВ-приставка
          </div>
          <div class="compareTable__caption-title">
            Модель
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb6">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="tvDeviceLeft">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ getDevices(tvDeviceLeft.device) }}
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
                <div v-if="tvDeviceRight">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ getDevices(tvDeviceRight.device) }}
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
        <template v-if="showTerms">
          <div class="compareTable__caption-title">
            Условия
          </div>
          <div class="compareTable__content-row bordered compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="tvDeviceLeft">
                  {{ tvDeviceLeft ? devicePrice(tvDeviceLeft) : '—' }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="tvDeviceRight">
                  {{ tvDeviceRight ? devicePrice(tvDeviceRight) : '—' }}
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
          <div class="compareTable__content-row compareTable__content-row_pt6 compareTable__content-row_pb8">
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="tvDeviceLeft">
                  {{ deviceBuyOrRent(tvDeviceLeft) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="compareTable__content-cell">
                <div v-if="tvDeviceRight">
                  {{ deviceBuyOrRent(tvDeviceRight) }}
                </div>
                <div v-else>
                  —
                </div>
              </div>
            </div>
          </div>
        </template>
        <!--.compareTable__caption Онлайн ТВ-->
        <!--.compareTable__content-row.compareTable__content-row_pt4.compareTable__content-cell.compareTable__text Просмотр на 5 устройствах: ТВ, смартфон, планшет, ноутбук
.compareTable__content-cell —
.compareTable__content-cell —
-->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { DevicePaymentHelper } from '~/mixins/DevicePaymentHelper'
import { DealDevice, DealTvPackage, DEAL_SERVICE_TYPE, IDealItem, ServiceTv } from '~/types/deals'
export default DevicePaymentHelper.extend({
  computed: {
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    activeSlidersLeft (): IDealItem {
      return this.compareList[this.swipeNextLeft]
    },
    activeSlidersRight (): IDealItem {
      return this.compareList[this.swipeNextRight]
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList ():IDealItem[] {
      return this.$vuex.compare.compareList
    },
    infoAboutChanelLeft (): (DealTvPackage|undefined) {
      const service = this.activeSlidersLeft?.services?.find(el => el.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv
      return service?.packages_use.find(el => el.included === true)
    },
    infoAboutChanelRight (): (DealTvPackage|undefined) {
      const service = this.activeSlidersRight?.services?.find(el => el.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv
      return service?.packages_use.find(el => el.included === true)
    },
    showChanel (): boolean {
      return (Boolean(this.infoAboutChanelLeft) || Boolean(this.infoAboutChanelRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.infoAboutChanelLeft)) !==
       (JSON.stringify(this.infoAboutChanelRight)) : true)
    },
    tvPackageLeft (): string|undefined {
      return this.infoAboutChanelLeft ? this.$vuex.tvPackage.byId(this.infoAboutChanelLeft?.package)?.name : this.infoAboutChanelLeft
    },
    tvPackageRight (): string|undefined {
      return this.infoAboutChanelRight ? this.$vuex.tvPackage.byId(this.infoAboutChanelRight?.package)?.name : this.infoAboutChanelRight
    },
    showTvPackage (): boolean {
      return (Boolean(this.tvPackageLeft) || Boolean(this.tvPackageRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.tvPackageLeft)) !==
       (JSON.stringify(this.tvPackageRight)) : true)
    },
    tvDeviceLeft (): (DealDevice | undefined) {
      return this.activeSlidersLeft?.device_use.find(el => this.deviceTv(el.services))
    },
    tvDeviceRight (): (DealDevice | undefined) {
      return this.activeSlidersRight?.device_use.find(el => this.deviceTv(el.services))
    },
    showTvDevice (): boolean {
      return (Boolean(this.tvDeviceLeft) || Boolean(this.tvDeviceRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.tvDeviceLeft)) !==
       (JSON.stringify(this.tvDeviceRight)) : true)
    },
    showCost (): boolean {
      return (Boolean(this.tvDeviceLeft) || Boolean(this.tvDeviceRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.deviceBuyOrRent(this.tvDeviceLeft))) !==
       (JSON.stringify(this.deviceBuyOrRent(this.tvDeviceRight))) : true)
    },
    showTerms (): boolean {
      return (Boolean(this.tvDeviceLeft) || Boolean(this.tvDeviceRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.devicePrice(this.tvDeviceLeft))) !==
       (JSON.stringify(this.devicePrice(this.tvDeviceRight))) : true)
    },
    showWholeBlock (): boolean {
      return [
        this.showChanel,
        this.showTvPackage,
        this.showTvDevice
      ].some(Boolean)
    }
  },
  methods: {
    deviceTv (devices: DEAL_SERVICE_TYPE[]): boolean {
      return devices.length === 1 && devices.some(el => el === DEAL_SERVICE_TYPE.TV)
    },
    getDevices (id: number): string|undefined {
      return this.$vuex.device.byId(id)?.Title
    }
  }
})
</script>
<style lang="scss" scoped>
.flex {
  width: 100%;
  max-width: 50%;
}
</style>
