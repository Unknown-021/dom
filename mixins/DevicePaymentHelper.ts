import Vue from 'vue'
import { DealDevice } from '~/types/deals'

export const DevicePaymentHelper = Vue.extend({
  methods: {
    deviceBuyOrRent (device: DealDevice|undefined): string {
      if (!device) {
        return ''
      }
      switch (true) {
        case !!device.cost_norm:
          return `<s>${device.cost_norm}</s>&nbsp;<b>${device.cost}</b> руб`
        case !!device?.cost:
        case !!device.single_payment:
          return `${device.cost || device.single_payment} руб`
        case !!device.installment_period:
          return `${device.monthly_payment} руб/мес на ${device.installment_period} мес`
        case !!device.monthly_payment:
          return `${device.monthly_payment} руб/мес`
        default: return 'Включен в тариф'
      }
    },
    devicePrice (item: DealDevice|undefined): string {
      if (!item) {
        return ''
      }
      switch (true) {
        case !!item.cost_norm:
          return 'Покупка '
        case !!item?.cost:
        case !!item.single_payment:
          return 'Покупка'
        case !!item.installment_period:
          return `Рассрочка ${item.installment_period} мес`
        case !!item.monthly_payment:
          return 'Аренда '
        default: return 'Включен в тариф'
      }
    }

  }
})
