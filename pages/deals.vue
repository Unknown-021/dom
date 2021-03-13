<template>
  <no-deals-found v-if="!$vuex.deals.locationHaveDeals" />
  <div v-else class="deals-page">
    <div class="offers">
      <deals-address-search />
      <div class="offers__holder">
        <div class="offers__sidebar">
          <filters-wrapper :key="filterKey" v-model="showFilters" />
        </div>
        <deals-wrapper />
      </div>
    </div>
    <deal-offer-added-to-compare />
    <div class="offers__controls">
      <nuxt-link
        class="btn btn-compare"
        to="/compare"
        tag="button"
        :disabled="!haveCompare"
        :class="[haveCompare && 'is-active']"
      >
        <img
          alt="image"
          class="compare"
          :src="
            require(`~/assets/images/sprite-svg/compare${
              haveCompare ? '-active' : ''
            }.svg`)
          "
        >
        Сравнение
        <span v-if="haveCompare" class="btn-compare__count">{{
          $vuex.compare.count
        }}</span>
      </nuxt-link>
      <button
        class="btn btn-filters is-active"
        @click="showFilters = !showFilters"
      >
        <img class="filters" src="~/assets/images/sprite-svg/filters.svg">
        <div class="svg-image-filters svg-image-filters-dims" />
        Фильтры
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
/* import { RadioFilterOption } from '~/types/filters'
 */

export default Vue.extend({
  async asyncData ({ $vuex, error, req, route }): Promise<any> {
    await $vuex.breadcrumbs.SetTariffCrumbs()
    try {
      await $vuex.layout.GetDealsPage()
      if (req) {
        await $vuex.deals.GetDeals(route.name === 'tariffs')
      } else {
        return { updateNeeded: true }
      }
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  data: () => ({
    showFilters: false,
    changeSubscribe: () => {},
    filterKey: new Date().valueOf(),
    updateNeeded: false
  }),
  computed: {
    haveCompare (): boolean {
      return this.$vuex.compare.count > 0
    },

    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  beforeDestroy () {
    this.changeSubscribe()
    this.$vuex.layout.mobileDeal = undefined
  },
  created () {
    const subscribes: (() => void)[] = [
      this.$vuex.filters.$subscribeAction('changed/ApplyHandler', {
        before: () => {},
        after: () => this.applyNewFilters()
      }),
      this.$vuex.filters.$subscribe('SET_SORT', () => this.applyNewFilters())
    ]
    this.changeSubscribe = () => subscribes.forEach(el => el())
    if (process.client && this.$vuex.analitic.cookieInfo !== 'true') {
      this.$vuex.analitic.SendInfoPeople({
        session_id: this.$vuex.analitic.userSessionId,
        yandex_id: this.$vuex.analitic.yandexMetricaCookies(),
        google_id: this.$vuex.analitic.googleAnaliticMetricaCookies(),
        ip: this.$vuex.analitic.userIP,
        request_type: 'address_check'
      })
    }
  },
  mounted () {
    if (this.updateNeeded) {
      this.$vuex.deals.GetDeals(this.$route.name === 'tariffs')
      this.updateNeeded = false
    }
  },
  methods: {
    applyNewFilters (): any {
      this.$router.push({ query: this.$vuex.filters.filtersQueryParams })
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.dealsPageSeo ?? [])
  },
  middleware: ['deals-filters'],
  beforeRouteUpdate (to, _from, next) {
    if (this.$vuex.layout.mobileDeal && to.name !== 'tariff-id') {
      this.$vuex.layout.mobileDeal = undefined
      return next(false)
    }
    this.$vuex.deals.GetDeals(to.name === 'tariffs')
    this.filterKey = new Date().valueOf()
    return next()
  },
  beforeRouteLeave (to, _from, next) {
    if (this.$vuex.layout.mobileDeal && to.name !== 'tariff-id') {
      this.$vuex.layout.mobileDeal = undefined
      return next(false)
    }
    return next()
  }
})
</script>

<style lang="scss" scoped>
  .compare {
    margin-right: 10px;
  }
</style>
