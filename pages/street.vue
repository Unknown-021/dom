<template>
  <div class="street">
    <street-house-number />
    <street-change-address />
    <providers-catalog />
    <street-easy-change />
    <street-faq />
    <main-callback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({ $vuex, error, route }) {
    try {
      const renderPagePromises: Promise<any>[] = [
        $vuex.layout.GetStreetPage(),
        $vuex.layout.GetStreetPageHouses({ city: route.params.city, street: route.params.street }),
        $vuex.breadcrumbs.SetStreetCrumbs()
      ]
      await Promise.all(renderPagePromises)
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  created () {
    this.$vuex.deals.GetLocationProviders()
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.streetPageSeo ?? [])
  }
})
</script>

<style lang="scss" scoped>

</style>
