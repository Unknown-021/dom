<template>
  <div class="callback-info-container">
    <div v-if="orders" div class="callback-info">
      Мы свяжемся с вами {{ orders.selectedDay }} {{ orders.selectedTime }} для
      уточнения деталей
    </div>
    <br>
    <hr>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Cookies from 'js-cookie'
import { OrderItem } from '~/types/orders'

export default Vue.extend({
  data: () => ({
    orders: {} as OrderItem
  }),
  created () {
    this.getOrder()
  },
  mounted () {
    this.orders.selectedDay = this.orders?.selectedDay?.toLowerCase()
  },
  methods: {
    getOrder () {
      if (process.client) {
        this.orders = this.$vuex.orders.orderList || JSON.parse(Cookies.get('user_is_waiting_for_a_call') || '{}')
      }
    }
  }
})
</script>

<style>
.callback-info {
  max-width: 426px;
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
}
hr {
  border: 1px solid #ededed;
}
</style>
