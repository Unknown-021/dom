<template>
  <div>
    <main-promo />
    <free-service />
    <popular-faq />
    <best-offers />
    <providers-catalog />
    <connection-faq />
    <!-- <subscribe-main /> -->
    <new-blog-posts />
    <main-callback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({ $vuex, error }) {
    try {
      const renderPagePromises: Promise<any>[] = [
        $vuex.breadcrumbs.SetMainCrumbs()
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
    this.$vuex.deals.GetBestOffersTV()
    this.$vuex.deals.GetBestOffers()
    this.$vuex.deals.GetLocationProviders()
    this.$vuex.blog.NewPosts(0)
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.mainPageSeo ?? [])
  }
})
</script>

<style lang="scss" scoped>
.provider__equipment-arrows--next {
  top: 100px;
}
</style>
