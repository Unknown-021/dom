<template>
  <div class="order-details-container">
    <h2 class="order-heading">
      Ваш заказ
    </h2>
    <div class="order-inner-container">
      <img
        class="provider-logo"
        src="~/assets/images/errors/error-500.png"
        alt=""
        style="max-width: 220px;"
      >
      <div v-if="tariff" class="order-info">
        <span v-if="provider" class="provider-name">{{ provider.Name }}</span>
        <span v-if="tariff" class="tarrif-name">{{ tariff.name }}</span>
        <span
          v-for="(item, index) in tariff.benefits"

          :key="index"
          class="tariff-benefits"
        >{{ item.text }}</span>
      </div>
      <div v-if="tariff" class="tariff-price">
        {{ tariff.price }}
        <div class="card__property-cost-period">
          руб<span>мес</span>
        </div>
      </div>
    </div>
    <d-expand-more v-if="tariff" :tariff="tariff" />
    <thank-you-modal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IDealItem } from '~/types/deals'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  data () {
    return {}
  },
  computed: {
    tariff (): IDealItem|undefined {
      return this.$vuex.deals.dealsOptions.deal(+this.$route.params.id)
    },
    provider (): IProvider|undefined {
      const providerID = this.tariff?.provider
      if (!providerID) {
        return
      }
      return this.$vuex.providers.byId(providerID)
    }
  },
  mounted () {
  }
})
</script>

<style scooped>

.order-heading {
  margin-top: 25px;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
}
.order-inner-container {
  display: flex;
}
.provider-logo {
  width: 80px;
  height: 80px;
}
.provider-name {
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #808080;
}
.order-info {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
}

.tarrif-name{
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  padding-top: 5px;
  color: #000000;
}
.tariff-benefits{
  padding-top: 5px;
}
.tariff-benefits:last-of-type{
  padding-bottom: 15px;
}
.tariff-price{
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.price-annotation{
  font-size: 10px;
}
.price-annotation span:first-of-type{
  border-bottom: 1px solid black;
}
.card__property-cost-period{
  margin-top: 6px;
  margin-left: 6px;
}

</style>
