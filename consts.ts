import sanitize from 'sanitize-html'
import { DealAttributeKeyType } from '~/types/deals'
import { TARIFF_PACKET_TYPE } from '~/types/filters'
import { ISelectedCity } from '~/types/location'

export const UNLIMITED_MODILE_TRAFFIC = 999

export const MOSCOW_OFFSET = 180

export namespace SANITIZE_CONFIGS {
  export const TARIFF_PAGE = undefined

  export const BLOG_PAGE: sanitize.IOptions = {
    allowedTags: sanitize.defaults.allowedTags.concat('img', 'video', 'iframe'),
    allowedAttributes: {
      '*': ['class', 'src']
    }
  }

  export const DEVICE_ITEM = undefined

  export const DEAL_CARD = undefined
}

export namespace DEAL_ATTRIBUTE_TYPES {
  export const FEATURES: DealAttributeKeyType[] = ['promo_period', 'credit_payment', 'contract']

  export const LABELS: DealAttributeKeyType[] = ['promo']
}

export const LOCATION_DEFAULT_CITY = 'rostov-na-donu'

export const CITY_POPULATION_SHOW_THRESHOLD = 300000
export const POPULAR_CITIES_IDS: ISelectedCity['id'][] = [1003, 810, 3]

export const PROVIDER_PAGE_TARIFF_TYPES: Partial<Record<TARIFF_PACKET_TYPE, string>> = {
  [TARIFF_PACKET_TYPE.INTERNET_TV]: 'Интернет + ТВ',
  [TARIFF_PACKET_TYPE.INTERNET]: 'Интернет',
  [TARIFF_PACKET_TYPE.TV]: 'ТВ',
  [TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR]: 'Интернет + ТВ + Связь'
}
