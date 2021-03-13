<template>
  <div>
    <provider-info :id="providerID" />
    <top-banner :id="providerID" />
    <tariffs-list :id="providerID" />
    <provider-call :id="providerID" />
    <equipment-wrapper :id="providerID" />
    <about-wrapper v-if="provider.About || provider.aboutBenefits.length" :id="providerID" />
    <blog-partners-news :is-provider="true" />
    <provider-questions :id="providerID" :is-desktop="isDesktop" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IArticle } from '~/types/blog'
import { DeviceDetail } from '~/types/device'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  async asyncData ({ params, $vuex, error }) {
    try {
      const [id] = (await $vuex.providers.FilterItems({ slug: params.id }))
      if (!id) {
        return error({
          statusCode: 404
        })
      }
      if ($vuex.location.isAddressFiled && id) {
        await $vuex.providerData.CheckProviderAvailable(Number(id))
      }
      const [deviceID] = await Promise.all([
        $vuex.providerData.InitProviderState(+id),
        $vuex.layout.GetProviderDetailPage()
      ])

      await $vuex.breadcrumbs.SetProvidersCrumbs($vuex.providers.byId(id)?.Name)
      $vuex.blog.blogPartnersNews.length ? await $vuex.blog.GetBlogPartnersNews(0) : await $vuex.blog.GetBlogPartnersNews(3)
      return {
        deviceID,
        providerID: id
      }
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  data: () => ({
    deviceID: [] as DeviceDetail['id'][],
    providerID: 0
  }),

  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(this.providerID)!
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    providerNewsList (): IArticle[] {
      return this.provider.posts
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.providerDetailPageSeo ?? [])
  }
})
</script>

<style lang="scss" scoped>

</style>
