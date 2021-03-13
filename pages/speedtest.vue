<template>
  <div class="speedtest">
    <speedtest-top />
    <speedtest-start />
    <speedtest-slow />
    <speedtest-connection />
    <speedtest-show-tariff />
    <speedtest-about />
    <div class="speedtest__line-wrap" />
    <speedtest-advantages />
    <speedtest-faq />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({ $vuex, error/* , req, route */ }): Promise<any> {
    try {
      await $vuex.layout.GetSpeedTestPage()
    } catch (e) {
      error({
        statusCode: 500
      })
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.speedTestPageSeo ?? [])
  }

})
</script>
