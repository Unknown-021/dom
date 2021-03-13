<template>
  <div class="cardItemDetail">
    <div class="cardItemDetail__header">
      <div
        class="cardItemDetail__header-back"
        @click="$vuex.layout.mobileDeal = undefined"
      >
        <img src="~/assets/images/sprite-svg/arrow-left-gray.svg">
      </div>
      <div class="cardItemDetail__header-logo">
        <!--  <img src="~/assets/images/tmp/img-06.png" alt=""> -->
        <img
          alt="image"
          :src="$cmsImg(provider && provider.FilterAndTariffHeaderLogo
            ? provider.FilterAndTariffHeaderLogo.url : '')"
        >
      </div>
      <div class="cardItemDetail__header-info">
        <div class="cardItemDetail__header-operator">
          {{ provider.Name }}
        </div>
        <div class="cardItemDetail__header-title">
          {{ item.name }}
        </div>
      </div>
      <div
        class="cardItemDetail__header-compare"
        :class="{ 'is-active': isInCompare }"
        @click="addThisItemToCompare"
      >
        <img
          v-if="isInCompare"
          alt="image"
          src="~/assets/images/sprite-svg/to-compare-active.svg"
        >
        <img v-else alt="image" src="~/assets/images/sprite-svg/to-compare.svg">
        <div class="cardItemDetail__header-compare-text">
          {{ isInCompare ? 'В сравнении' : 'Сравнить' }}
        </div>
      </div>
    </div>
    <div class="cardItemDetail__content">
      <div v-if="hasTags" class="cardItemDetail__content-tags">
        <deal-card-labels :labels="item.attributes" :center="true" />
      </div>
      <div
        v-if="item && item.benefits.length"
        class="cardItemDetail__property"
        style="margin-left: 15px"
      >
        <div
          v-for="(item, index) in item.benefits"
          :key="index"
          class="cardItemDetail__property-benefit"
          v-html="formatBenefit(item.text)"
        />
      </div>
      <div v-if="internetRows.length" class="cardItemDetail__property">
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <img
              alt="image"
              src="~/assets/images/sprite-svg/internet-accent.svg"
              width="23"
              height="28"
            >
          </div>
          <div class="cardItemDetail__property-title">
            Интернет
          </div>
        </div>
        <deal-card-mobile-row
          v-for="(row, index) in internetRows"
          :key="index"
          :row="row"
        />
      </div>
      <div v-if="tvRows.length" class="cardItemDetail__property">
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <img
              alt="image"
              src="~/assets/images/sprite-svg/tv-accent.svg"
              width="23"
            >
          </div>
          <div class="cardItemDetail__property-title">
            Телевидение
          </div>
          <a class="link link_dotted link_accent js-linkChannels" href="#">
            <div class="link__icon">
              <div class="svg-image-arrow-right svg-image-arrow-right-dims" />
            </div>
            <div class="link__text">Все каналы</div></a>
        </div>
        <deal-card-mobile-row
          v-for="(row, index) in tvRows"
          :key="index"
          :row="row"
        />
      </div>
      <div
        v-if="cctvRows && cctvRows.length > 0"
        class="cardItemDetail__property"
      >
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <img src="~/assets/images/sprite-svg/security-accent.svg">
          </div>
          <div class="cardItemDetail__property-title">
            Видеонаблюдение
          </div>
        </div>
        <deal-card-mobile-row
          v-for="(row, index) in cctvRows"
          :key="index"
          :row="row"
        />
      </div>

      <div v-if="mobileRows.length" class="cardItemDetail__property">
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <img
              alt="image"
              src="~/assets/images/sprite-svg/mobile-accent.svg"
              width="23"
              height="28"
            >
          </div>
          <div class="cardItemDetail__property-title">
            Мобильная связь
          </div>
        </div>
        <deal-card-mobile-row
          v-for="(row, index) in mobileRows"
          :key="index"
          :row="row"
        />
      </div>

      <div v-if="item.content.length" class="cardItemDetail__property">
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <img src="~/assets/images/sprite-svg/info.svg" alt="" width="28">
          </div>
          <div class="cardItemDetail__property-name" v-html="$sanitize(item.content)" />
        </div>
      </div>
      <div class="cardItemDetail__property">
        <div class="cardItemDetail__property-header">
          <div class="cardItemDetail__property-icon">
            <div class="svg-image-cost-accent svg-image-cost-accent-dims">
              <img
                alt="image"
                src="~/assets/images/sprite-svg/price.svg"
                width="28"
              >
            </div>
          </div>
          <div class="cardItemDetail__property-title">
            Стоимость
          </div>
        </div>
        <div class="cardItemDetail__property-row">
          <div class="cardItemDetail__property-name">
            Абонентская плата
          </div>
          <div class="cardItemDetail__property-value">
            {{ item.price }}
            <div class="cardItemDetail__property-currency">
              руб/мес
            </div>
          </div>
        </div>
        <div class="cardItemDetail__property-row">
          <div class="cardItemDetail__property-name">
            Подключение
          </div>
          <div class="cardItemDetail__property-value">
            {{ installCost }}
            <div class="cardItemDetail__property-currency">
              руб
            </div>
          </div>
        </div>
        <div v-if="hasWifiRouter" class="cardItemDetail__property-row">
          <div class="cardItemDetail__property-name">
            Роутер ({{ routerPaymentType.toLowerCase() }})
            {{ internetRows.filter(el=>el.title === 'Wi-Fi-роутер').value }}
          </div>
          <div v-if="!isRouterIncluded" class="cardItemDetail__property-value">
            {{ routerCost }}
            <div class="cardItemDetail__property-currency">
              руб/мес
            </div>
          </div>
        </div>
        <div v-if="tvRows && tvRows.length && tvCost" class="cardItemDetail__property-row">
          <div class="cardItemDetail__property-name">
            ТВ-приставка
          </div>
          <div v-if="!isTVIncluded && tvCost" class="cardItemDetail__property-value">
            {{ tvCost }}
            <div class="cardItemDetail__property-currency">
              руб
            </div>
          </div>
          <div v-else-if="isTVIncluded" class="cardItemDetail__property-value">
            Включена в тариф
          </div>
        </div>
        <div v-if="bindingContractDuration > 0" class="cardItemDetail_dash" />
        <div v-if="bindingContractDuration > 0" class="cardItemDetail__property-row">
          Контракт на <span class="cardItemDetail__contact-duration"> {{ bindingContractDuration }} </span>  месяцев
        </div>
      </div>
    </div>
    <div class="cardItemDetail__footer">
      <div class="cardItemDetail__cost-item">
        <div class="cardItemDetail__cost">
          <div class="cardItemDetail__cost-value">
            {{ item.price }}
          </div>
          <div class="cardItemDetail__cost-period">
            руб<span>мес</span>
          </div>
        </div>
      </div>
      <d-btn primary submit :to="tariffPage">
        Подключить
      </d-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Base from './DealCardBase'
import { UNLIMITED_MODILE_TRAFFIC } from '~/consts'
import {
  DEAL_SERVICE_TYPE,
  ServiceInternet,
  ServiceMobile,
  DealDevice,
  ServiceTv
} from '~/types/deals'
import { DeviceHelper } from '~/utils/DeviceHelper'

export interface TariffItemRow {
  title: string;
  subtitle?: string;
  value: string | number;
  subvalue?: string;
}

export default Base.extend({
  // TODO: ADD DEVICES!!!!!!!!!!
  computed: {
    content () {
      return this.item.content.split('<p')
    },
    routerPaymentType (): string | undefined {
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)))
      let devicePayment = deviceInfo && DeviceHelper.GetHumanPayment(deviceInfo.method)
      if (devicePayment === 'Включено в стоймость') {
        devicePayment = 'Включен в тариф'
      }
      return devicePayment
    },
    isRouterIncluded (): boolean {
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)))
      const devicePayment = deviceInfo && DeviceHelper.GetHumanPayment(deviceInfo.method)
      if (devicePayment === 'Включено в стоймость') {
        return true
      }
      return false
    },
    isTVIncluded (): boolean {
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.TV)))
      const devicePayment = deviceInfo && DeviceHelper.GetHumanPayment(deviceInfo.method)
      if (devicePayment === 'Включено в стоймость') {
        return true
      }
      return false
    },
    tvCost () {
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.TV)))
      return deviceInfo?.cost
    },
    routerCost (): number | null{
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.INTERNET)))
      return deviceInfo?.monthly_payment || null
    },
    internetRows (): TariffItemRow[] {
      const internet = this.item.services.find(
        el => el.service_type === DEAL_SERVICE_TYPE.INTERNET
      ) as ServiceInternet | undefined
      if (!internet) {
        return []
      }
      const coonectionType = (this.item.technology[0].includes('DSL')) ? 'DSL' : 'Оптика'
      const devicePayment = this.routerPaymentType

      return [
        { title: 'Скорость', value: `${internet.speed} ${internet.units}` },
        { title: 'Тип подключения', value: `${coonectionType || ''}` },
        { title: 'Трафик', value: 'Неограничено' },
        { title: 'Wi-Fi-роутер', value: `${devicePayment || ''}` }
      ].filter(el => Boolean(el.value))
    },
    devicesMap (): Record<DealDevice['device'], { id: DealDevice['device'], count: number }> {
      return this.$vuex.deals.dealsOptions.dealOptions(this.item.id)?.devices ?? {}
    },
    tvRows (): TariffItemRow[] {
      const tv = this.item.services.find(
        el => el.service_type === DEAL_SERVICE_TYPE.TV
      ) as ServiceTv | undefined
      if (!tv) {
        return []
      }
      const currentPackage = tv.packages_use.find(el => el.included === true)
      const chanels = currentPackage?.channels_count || 0
      const hdChanels = currentPackage?.hd_channels_count || 0
      const packageName = this.$vuex.tvPackage.byId(currentPackage?.package || 0)?.name

      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.TV)))
      let devicePayment = deviceInfo && DeviceHelper.GetHumanPayment(deviceInfo.method)
      if (devicePayment === 'Включено в стоймость') {
        devicePayment = 'Включена в тариф'
      }
      // #TODO: Доделать подписки
      return [{ title: 'Количество каналов', value: `${chanels || ''}` },
        { title: 'HD каналы', value: `${hdChanels || ''}` },
        { title: 'Пакет каналов', value: `${packageName || ''}` },
        { title: 'TV-приставка', value: `${devicePayment || ''}`, subvalue: !this.isTVIncluded ? `${deviceInfo?.monthly_payment + '' + 'руб/мес'}` : '' }
        /* { title: 'Подписки', value: `${'winx'}` } */].filter(el => Boolean(el.value))
    },
    cctvRows (): TariffItemRow[] {
      const cctv = this.item.services.find(
        el => el.service_type === DEAL_SERVICE_TYPE.CCTV
      ) as ServiceMobile | undefined
      if (!cctv) {
        return []
      }
      const deviceInfo = (this.item.device_use.find(el => el.services.some(el => el === DEAL_SERVICE_TYPE.CCTV)))
      let devicePayment = deviceInfo && DeviceHelper.GetHumanPayment(deviceInfo.method)
      if (devicePayment === 'Включено в стоймость') {
        devicePayment = 'Включена в тариф'
      }
      // #TODO: Доделать пункт с хранением данных
      return [
        {
          title: 'Хранение данных в облаке', value: ''
        },
        {
          title: 'Видеокамера', value: `${devicePayment || ''}`
        }
      ].filter(el => Boolean(el.value))
    },
    mobileRows (): TariffItemRow[] {
      const mobile = this.item.services.find(
        el => el.service_type === DEAL_SERVICE_TYPE.MOBILE
      ) as ServiceMobile | undefined
      if (!mobile) {
        return []
      }
      return [
        {
          title: 'Количество SIM',
          value: mobile.sim_count === 1 ? 0 : mobile.sim_count
        },
        {
          title: 'Трафик',
          value:
            mobile.gigabytes === UNLIMITED_MODILE_TRAFFIC
              ? '∞'
              : `${mobile.gigabytes} Гб`
        },
        { title: 'Минуты', value: mobile.minutes },
        { title: 'Сообщения', value: mobile.sms }
      ].filter(el => Boolean(el.value))
    },
    hasTags (): boolean {
      const index = this.item.attributes.findIndex(el => el.group_key === 'tags')
      if (index < 0) { return false }
      return true
    },
    hasWifiRouter (): boolean {
      const ifRouter = this.internetRows.filter(el => el.title === 'Wi-Fi-роутер')
      return ifRouter.length > 0
    }, /*
    routerInTarif (): string {
      return this.internetRows.filter(el => el.title === 'Wi-Fi-роутер')
    }, */
    tagName (): string {
      const index = this.item.attributes.findIndex(el => el.group_key === 'tags')
      return this.item.attributes[index].name
    },
    installCost (): string | number {
      const install = this.item.attributes.find(el => el.key === 'install_payment')
      return install?.value ?? 0
    },

    bindingContractDuration () {
      const contract = this.item.attributes.find(el => el.key === 'contract')
      if (contract) {
        return contract.value
      }
      return false
    }
  },
  methods: {
    formatBenefit (text: string) {
      return `<span class="dash" style="margin-right: 6px">—  </span><div>${text.replace(
        /\d+/g,
        match => `<span class="accent">${match}</span>`
      )}</div>`
    }
  }
})
</script>

<style  lang="scss" scoped>
.cardItemDetail__property-name::v-deep{
  p {
  margin: 0;
}
}
.cardItemDetail__property-benefit {
  display: flex;
}
.dash {
  margin-right: 6px;
}
.card__label-item{
  align-items: center;
  padding: 0px 12px 0;
}
.cardItemDetail__content-tags{
  margin-bottom: 12px;
}
.cardItemDetail__footer {
  display: flex;
}
.cardItemDetail_dash{
  max-width: 55px;
  width: 100%;
  height: 1px;
  background-color: #E0E0E0;
 margin-bottom: 4px;
}
.cardItemDetail__contact-duration{
  color: #2E388D;
  white-space: pre;
}

</style>
