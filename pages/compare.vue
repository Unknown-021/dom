<template lang="pug">
  compare-layout-desktop(
    :compareList="compareList"
    v-if="isDesktop"
  )
  compare-layout-mobile(
    :compareList="compareList"
    v-else
  )
</template>

<script lang="ts">
import Vue from 'vue'
import { DEAL_SERVICE_TYPE, IDealItem, ServiceTv } from '~/types/deals'

export default Vue.extend({
  async asyncData ({ $vuex, error }) {
    await $vuex.breadcrumbs.SetMainCrumbs()
    try {
      await $vuex.layout.GetComparePage()
      const devicesPromise = $vuex.device.GetByID(
        $vuex.compare.compareList
          .map(el => el.device_use.map(i => i.device))
          .flat()
          .filter((el, i, arr) => arr.indexOf(el) === i)
      )

      const tvPackPromise = $vuex.tvPackage.GetByID(
        $vuex.compare.compareList
          .map(el => el.services)
          .flat()
          .filter(el => el.service_type === DEAL_SERVICE_TYPE.TV)
          .map(el => (el as ServiceTv).packages_use.map(i => i.package))
          .flat()
      )

      await Promise.all([
        devicesPromise,
        tvPackPromise
      ])
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  data () {
    return {
      deleteSubscription: () => {}
    }
  },
  async middleware ({ $vuex, redirect }) {
    if (!$vuex.compare.compareList.length) {
      redirect({
        name: 'deals',
        params: {
          city: this.$vuex.location.userCity.citySlug || '',
          street: this.$vuex.location.userStreet.streetSlug,
          house: this.$vuex.location.userHouse.houseSlug || ''
        },
        query: $vuex.filters.filtersQueryParams
      })
    }
  },
  computed: {
    isDesktop () {
      return this.$device.isDesktopOrTablet
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    }
  },
  created () {
    const subscribes = ['RemoveCompareItem', 'DeleteAllCompareList'].map(mut => this.$vuex.compare.$subscribe(mut, () => {
      if (!this.$vuex.compare.compareList.length) {
        this.$router.push({
          name: 'deals',
          params: {
            city: this.$vuex.location.userCity.citySlug || '',
            street: this.$vuex.location.userStreet.streetSlug,
            house: this.$vuex.location.userHouse.houseSlug || ''
          },
          query: this.$vuex.filters.filtersQueryParams
        })
      }
    }))
    this.deleteSubscription = () => subscribes.forEach(fn => fn())
  },
  beforeDestroy () {
    this.deleteSubscription()
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.comparePageSeo ?? [])
  }
})
</script>

<style lang="scss" scoped>

</style>
