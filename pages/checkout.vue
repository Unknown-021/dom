<template>
  <div class="checkout">
    <div class="headerInfo-bg" style="background: #7800FF" />
    <br>
    <div class="checkout-container">
      <h2 class="checkout-title">
        Заявка успешно оформлена!
      </h2>
      <user-selected-time />
      <order-details />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DEAL_SERVICE_TYPE, ServiceTv } from '~/types/deals'

export default Vue.extend({
  async asyncData ({ $vuex, error, route }): Promise<any> {
    const id = +route.params.id
    try {
      await $vuex.deals.dealsOptions.GetTariffAsSelected(id)
      const devicePromise = $vuex.device.GetByID($vuex.deals.dealsOptions.deal(+route.params.id)?.device_use.map(el => el.device))
      const tvpackagePromises = $vuex.tvPackage.GetByID(
        ($vuex.deals.dealsOptions.deal(+route.params.id)
          ?.services
          .find(el => el.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv)
          ?.packages_use
          .map(el => el.package) || []
      )
      await Promise.all([
        devicePromise,
        tvpackagePromises
      ])
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  async created  () {
    if (process.client) {
      await this.$vuex.deals.dealsOptions.SET_NEW_OPTION({
        id: +this.$route.params.id,
        payload: JSON.parse(localStorage.getItem('tariffOptions') || '{}')
      })
    }
  }
})
</script>
<style scooped>
.headerInfo-bg{
  top: 107px;
}
.checkout-container{
  background-color: white;
  max-width: 919px;
  margin: 0 auto;
  position: relative;
  top: 20px;
  padding: 25px;
  margin-bottom: 50px;
  border-radius: 5px;
}
.checkout-title{
  color: #EE3C6B;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
}
</style>
