<template>
  <div class="tariff_page">
    <div class="headerInfo">
      <div class="headerInfo-bg" style="background: #7800FF" />
      <div class="container">
        <div class="headerInfo-value">
          <div class="headerInfo-content">
            <div class="tariffProvider__wrapper">
              <div class="tariffProvider">
                <div v-if="provider && provider.FilterAndTariffHeaderLogo" class="tariffProvider__logo">
                  <img :src="$cmsImg(provider.FilterAndTariffHeaderLogo.url)" alt="">
                </div>
                <div id="tariffProviderMenu" class="tariffProvider__menu">
                  <div v-if="provider" class="tariffProvider__menu-item">
                    <!-- <nuxt-link
                      class="link tariffProvider__menu-link link_accent"
                      :to="$regionLink({ name: 'providers-id',
                                         params: {
                                           city: $vuex.location.userCity.citySlug || undefined,
                                           street: $vuex.location.userStreet.streetSlug || undefined,
                                           house: $vuex.location.userHouse.houseSlug || undefined,
                                           id: provider.slug } })"
                    >
                      <span class="link__text">О провайдере</span>
                    </nuxt-link> -->
                  </div>
                <!--   <div class="tariffProvider__menu-item">
                    <a class="link tariffProvider__menu-link link_accent" href="#"><span class="link__text">Интернет+ТВ</span><span class="link__icon"><span class="svg-image-arrow-down-accent svg-image-arrow-down-accent-dims" /></span></a>
                  </div>
                  <div class="tariffProvider__menu-item">
                    <a class="link tariffProvider__menu-link link_accent" href="#"><span class="link__text">Все тарифы</span></a>
                  </div> -->
                </div>
                <div class="tariffProvider__contact">
                  <div class="tariffProvider__contact-caption">
                    Подключение
                  </div><a class="tariffProvider__contact-number" href="tel:88003355565"><img class="tariffProvider__contact-icon" src="~/assets/images/sprite-svg/phone-white.svg">8 800 335 55 65</a>
                  <div class="tariffProvider__contact-notice">
                    Бесплатный звонок по РФ
                  </div>
                </div>
                <div id="tariffProviderMenuToggler" class="tariffProvider__menu-toggler">
                  <div class="svg-image-menu svg-image-menu-dims" />
                </div>
              </div>
              <client-only>
                <tariff-address-search :id="id" :provider="provider" />
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="tariff" class="tariff">
        <div class="tariff__info">
          <div class="tariff__info-title">
            <h1>Тариф {{ tariff.name }}</h1>
          </div>
          <div class="tariff__info-description">
            <card-benefits :items="tariff.benefits" />
          </div>
        </div>
        <div class="tariff__content">
          <tariff-deal v-for="item in services" :key="item.service_type" :item="item" :tariff="tariff" />
          <tariff-deal-layout v-if="formattedText" name="Примечания">
            <template v-slot:header-icon>
              <img src="~/assets/images/sprite-svg/info.svg">
            </template><template v-slot:header-info>
              <div v-html="formattedText" />
            </template>
          </tariff-deal-layout>
          <tariff-deal-layout v-if="faqData" hide-header="hide-header" name="Часто задаваемые вопросы">
            <tariff-faq-block :items="faqData" />
          </tariff-deal-layout>
          <!-- <tariff-notification-block /> -->
        </div>
        <div class="tariff__sidebar">
          <tariff-aside-price :id="id" />
          <div class="tariffOrder tariffOrder_mobile">
            <div class="card__property">
              <div class="card__property-title">
                Абонентская плата
              </div>
              <div class="card__property-cost">
                <div class="card__property-cost-value">
                  {{ tariff.price }}
                </div>
                <div class="card__property-cost-period">
                  руб<span>мес</span>
                </div>
              </div>
            </div><a class="btn btn-primary btn-submit" href="#connect_form">Оформить заявку</a>
          </div>
          <tariff-adress-check-modal :id="id" :provider="provider"></tariff-adress-check-modal>
          <tariff-aside-connect-form />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TariffAdressCheckModal from '~/components/layout/TariffAdressCheckModal.vue'
import { SANITIZE_CONFIGS } from '~/consts'
import { DealServiceItem, DEAL_SERVICE_TYPE, IDealItem, ServiceTv } from '~/types/deals'
import { UtilityObject } from '~/utils/UtilityObject'
import { IProvider } from '~/types/providers'
import { ITariffBlockPage } from '~/types/layout'
export default Vue.extend({
  components: { TariffAdressCheckModal },
  async asyncData ({ $vuex, params, error/* , from */ }) {
    /* if (from && from.params.id === params.id) {
      await $vuex.deals.dealsOptions.GetTariffAsSelected(Number(params.id))
      return { id: +params.id }
    } */
    try {
      await $vuex.tariff.GetTariffID(+params.id)
      await $vuex.layout.GetTariffPage()
      if ($vuex.location.isAddressFiled) {
        await $vuex.tariff.CheckTariffAvailable(Number(params.id))
      }
      await $vuex.deals.dealsOptions.GetTariffAsSelected(Number(params.id))
      const thisDeal = $vuex.deals.dealsOptions
        .deal(Number(params.id))
      const deviceArr: number[] = []
      thisDeal.device_use.forEach((el) => { deviceArr.push(el.device) })
      const devicePromisesCMS = $vuex.device.GetByID(deviceArr)
      const devicePromisesBack = $vuex.backDevice.GetByID(deviceArr)
      const tvPackagePromises = $vuex.tvPackage.GetByID(
        (thisDeal.services.find(el => el.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv|undefined)
        ?.packages_use
        ?.map(el => el.package) ?? []
      )
      const tvChannelsIds = (await tvPackagePromises)
        .reduce((acc, el) => [...acc, ...el.channels], [] as number[])
        .filter((id, idx, arr) => arr.indexOf(id) === idx)
      const tvChannelsPromises = $vuex.tvChannel.GetByID(tvChannelsIds)
      // any type cause we just preloading all data in one array
      await Promise.all<any>([
        devicePromisesCMS,
        tvChannelsPromises,
        devicePromisesBack
      ])
      await $vuex.breadcrumbs.SetTariffCrumbs({ name: thisDeal.name })
      return { id: thisDeal.id }
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  async middleware ({ $vuex, query, redirect, params, error, from }) {
    try {
      if (from?.name === 'tariff-id' && from.params.id === params.id) {
        return
      }
      const id = Number(params.id)
      await $vuex.deals.dealsOptions.ParseQueryToOptions({ id, query: query ?? {} })
      const neededQuery = await $vuex.deals.dealsOptions.GetQueryFromOptions(id)
      if (!UtilityObject.hasAllKeys(query, neededQuery)) {
        return redirect({
          query: neededQuery
        })
      }
    } catch (e) {
      error({
        statusCode: 500,
        message: e.message
      })
    }
  },
  data: () => ({
    /*     faqData, */
    id: 0,
    unsubscribeFn: () => {}
  }),
  computed: {
    formattedText (): string {
      return this.$sanitize(this.tariff.content, SANITIZE_CONFIGS.TARIFF_PAGE)
    },
    tariff (): IDealItem {
      return this.$vuex.deals.dealsOptions.deal(this.id)
    },
    services (): DealServiceItem[] {
      return [...this.tariff.services].sort((a, b) => a.service_type - b.service_type)
    },
    provider (): IProvider|undefined {
      return this.tariff?.provider ? this.$vuex.providers.byId(this.tariff?.provider) : undefined
    },
    faqData (): ITariffBlockPage['FildsWithImage']['Items']|null {
      return this.$vuex.layout.tariffPage?.FildsWithImage.Items ?? null
    }
  },
  mounted () {
    const subscribes = [
      'dealsOptions/SET_NEW_OPTION',
      'dealsOptions/DELETE_SELECTED_DEVICE',
      'dealsOptions/ADD_ADDITIONAL_PACKAGE',
      'dealsOptions/REMOVE_ADDITIONAL_PACKAGE'
    ].map(mut => this.$vuex.deals.$subscribe(mut, this.updateQuery))
    this.unsubscribeFn = () => subscribes.forEach(fn => fn())
  },
  beforeDestroy () {
    this.unsubscribeFn()
  },
  methods: {
    async updateQuery ({ id }: { id: number }) {
      if (id === this.tariff.id) {
        const query = await this.$vuex.deals.dealsOptions.GetQueryFromOptions(id)
        this.$router.replace({ query }).catch(() => {})
      }
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.tariffPageSeo ?? [])
  },
  validate ({ params, error }) {
    if (!/^\d+$/.test(params.id)) {
      error({
        statusCode: 404,
        message: 'Invalid url parameter'
      })
      return false
    }
    return true
  }
})
</script>
<style lang="scss" scoped>
.headerInfo {
  position: relative;
  z-index: 1;
  &-value {
    margin: 0;
    padding: 0;
    border: 0;
    @media (max-width: 1024px) {
      background: none;
      box-shadow: none;
    }
  }
}
.headerInfo-content {
  padding-bottom: 30px;
}
.tariffProvider__wrapper {
  margin-left: 2px;
  margin-right: 2px;
}
.container {
  position: relative;
  z-index: 9;
}
.tariffOrder {
  .btn-submit{
    @media(max-width: 320px) {
      padding-left: 12px;
      padding-right: 12px;
      font-size: 14px;
    }
  }
}
</style>
