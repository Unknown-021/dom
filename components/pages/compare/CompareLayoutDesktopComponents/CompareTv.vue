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
              <div v-for="(list, index) in infoAboutChanel" :key="index" class="compareTable__content-cell">
                <div v-if="list">
                  <span class="cost__value">{{ list.channels_count }}</span>
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
              <div v-for="(list, index) in infoAboutChanel" :key="index" class="compareTable__content-cell">
                <div v-if="list">
                  <span class="cost__value">
                    {{ list.hd_channels_count || '0 HD' }}
                  </span>
                  <span v-if="list.hd_channels_count"> HD-каналов</span>
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
              <div v-for="(list, index) in tvPackage" :key="index" class="compareTable__content-cell">
                <span v-if="list">
                  {{ list }}
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
              <div v-for="(item, index) in tvDevice" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  <div class="compareTable__equipment">
                    <div class="compareTable__equipment-image">
                      <img src="~/assets/images/tmp/img-14.png" alt="">
                    </div>
                    <div class="compareTable__equipment-title">
                      {{ getDevices(item.device) }}
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
              <div v-for="(item, index) in tvDevice" :key="index" class="compareTable__content-cell">
                <div v-if="item">
                  {{ item ? devicePrice(item) : '—' }}
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
              <div v-for="(item, index) in tvDevice" :key="index" class="compareTable__content-cell">
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
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    activeSliders (): IDealItem[] {
      return [...this.compareList, ...this.compareList].slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList ():IDealItem[] {
      return this.$vuex.compare.compareList
    },
    infoAboutChanel (): (DealTvPackage|undefined)[] {
      return this.activeSliders
        .map(item => item.services
          .find(el => el.service_type === 2)as ServiceTv)
        .map(el => el ? el.packages_use.find(el => el.included === true) : el
        )
    },
    showChanel (): boolean {
      return this.infoAboutChanel.some(Boolean) && this.infoAboutChanel.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.channels_count !== arr[i - 1]?.channels_count) ||
        (i !== 0 && el?.hd_channels_count !== arr[i - 1]?.hd_channels_count)
      })
    },
    tvPackage (): (string|undefined)[] {
      return this.infoAboutChanel.map(el => el ? this.$vuex.tvPackage.byId(el?.package)?.name : el)
    },
    showTvPackage (): boolean {
      return this.infoAboutChanel.some(Boolean) && this.infoAboutChanel.some((el, i, arr) => {
        const prevItem = arr[i - 1]
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el && prevItem && this.$vuex.tvPackage.byId(el.package) !== this.$vuex.tvPackage.byId(prevItem.package))
      })
    },
    tvDevice (): (DealDevice | undefined)[] {
      return this.activeSliders.map(item => item.device_use.find(el => this.deviceTv(el.services)))
    },
    showTvDevice (): boolean {
      return this.tvDevice.some(Boolean) && this.tvDevice.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el?.device !== arr[i - 1]?.device)
      })
    },
    showCost (): boolean {
      return this.tvDevice.some(Boolean) && this.tvDevice.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && this.deviceBuyOrRent(el) !== this.deviceBuyOrRent(arr[i - 1]))
      })
    },
    showTerms (): boolean {
      return this.tvDevice.some(Boolean) && this.tvDevice.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && this.devicePrice(el) !== this.devicePrice(arr[i - 1]))
      })
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
  display: flex;
}
</style>
