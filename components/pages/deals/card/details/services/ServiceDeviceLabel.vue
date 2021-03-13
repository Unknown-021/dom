<template>
  <div class="card__position-description">
    {{ deviceType }}
    <img :src="priceIcon">
    <br>
    <span v-html="devicePrice" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DealDevice, DEAL_SERVICE_TYPE } from '~/types/deals'

export default Vue.extend({
  props: {
    device: {
      type: Object as PropType<DealDevice>,
      required: true
    }
  },
  computed: {
    priceIcon (): string {
      const priceKeys: (keyof DealDevice)[] = ['cost', 'cost_norm', 'monthly_payment', 'single_payment']
      return priceKeys.some(key => !!this.device[key])
        ? require('~/assets/images/sprite-svg/not-included.svg')
        : require('~/assets/images/sprite-svg/included.svg')
    },
    deviceType (): string {
      switch (true) {
        case this.device.services.includes(DEAL_SERVICE_TYPE.TV) && this.device.services.length === 1: return 'TV-приставка'
        case this.device.services.includes(DEAL_SERVICE_TYPE.INTERNET): return 'Wi-Fi Роутер'
        case this.device.services.includes(DEAL_SERVICE_TYPE.CCTV): return 'Видеокамера'
        default: return 'Устройство'
      }
    },
    devicePrice (): string {
      const device = this.device
      switch (true) {
        case !!device.cost_norm:
          return `Покупка за <s>${device.cost_norm}</s>&nbsp;<b>${device.cost}</b> руб`
        case !!device.cost:
        case !!device.single_payment:
          return `Покупка за ${device.cost || device.single_payment} руб`
        case !!device.installment_period:
          return `Рассрочка – ${device.monthly_payment} руб/мес на ${device.installment_period} мес`
        case !!device.monthly_payment:
          return `Аренда – ${device.monthly_payment} руб/мес`
        default: return 'Включен в тариф'
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
