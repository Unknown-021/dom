import { DealDevice } from '~/types/deals'
import { DeviceKind } from '~/types/device'
import { TARIFF_PACKET_TYPE } from '~/types/filters'
import { DEVICE_BUY_METHOD } from '~/types/tariff'

export class DeviceHelper {
  static GetHumanType (type: DeviceKind) {
    switch (type) {
      case DeviceKind.ROUTER: return 'Роутер'
      case DeviceKind.TV_BOX: return 'ТВ-приставка'
      case DeviceKind.VIDEO_CAMERA: return 'Видеокамера'
      default: return 'Устройство'
    }
  }

  static GetHumanPayment (method: DEVICE_BUY_METHOD) {
    switch (method) {
      case DEVICE_BUY_METHOD.BUY: return 'Покупка'
      case DEVICE_BUY_METHOD.CREDIT: return 'Рассрочка'
      case DEVICE_BUY_METHOD.INCLUDED: return 'Включено в стоймость'
      case DEVICE_BUY_METHOD.RENT: return 'Аренда'
      default: return 'Покупка'
    }
  }

  static GetHumanServices (method: TARIFF_PACKET_TYPE) {
    switch (+(method)) {
      case TARIFF_PACKET_TYPE.INTERNET: return 'Интернет'
      case TARIFF_PACKET_TYPE.INTERNET_TV: return 'Интернет+ТВ'
      case TARIFF_PACKET_TYPE.TV: return 'ТВ'
      case TARIFF_PACKET_TYPE.INTERNET_CELLULAR: return 'Интернет+Связь'
      case TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR: return 'Интернет+ТВ+Связь'
      case TARIFF_PACKET_TYPE.CCTV: return 'Видеонаблюдение'
      default: return 'Покупка'
    }
  }

  static GetPrice (device: DealDevice): [price: number, isPeriodic: boolean] {
    if (device.monthly_payment === null) {
      return [0, true]
    } else {
      return [device.monthly_payment!, true]
    }
  }

  static IsPeriodicPayment (method: DEVICE_BUY_METHOD) {
    return [DEVICE_BUY_METHOD.CREDIT, DEVICE_BUY_METHOD.RENT].includes(method)
  }
}
