import Vue from 'vue'
import { action, createModule, createSubModule, mutation } from 'vuex-class-component'
import api from '~/api'
import { DealsLabelsStore } from '~/store/dealsLabels'
import { DealsOptionsStore } from '~/store/dealsOptions'
// import { emptyLocation } from '~/subscribes/location'
import { DEALS_SORT_TYPES, DEAL_SERVICE_TYPE, IDealItem, ServiceTv } from '~/types/deals'
import { /* FilterLocationData, */ FilterOption, TARIFF_PACKET_TYPE } from '~/types/filters'
import { IProvider } from '~/types/providers'

export class DealsStore extends createModule({
  target: 'nuxt',
  namespaced: 'deals'
}) {
  dealsLabels = createSubModule(DealsLabelsStore)
  dealsOptions = createSubModule(DealsOptionsStore)

  private _deals: IDealItem[] = [];
  private _loading = false;
  private _loadingMore = false;
  private savedDeals = '';
  private _dealsCount = 0;
  private _providersCount = 0;
  public errorDeals = false;
  private nextPage = false;
  public locationProviders: Record<IProvider['SourceID'], number> | null = null;
  public locationHaveDeals = true;
  public bestOffers: IDealItem[] = [];
  public bestOffersTV: IDealItem[] = [];

  @action async GetDeals (onlyCity = false) {
    const params = this.$store.rootGetters['filters/filtersQueryParams']
    const location: {city_fias_id: string, house_id?: string} = {
      city_fias_id: this.$store.rootState.location.selectedCity.fias_id,
      ...(onlyCity ? {} : { house_id: this.$store.rootState.location.userHouse.house_id })
      //  ...emptyLocation,
      // ...this.$store.rootState.location.userCity,
      // // fias_level: onlyCity ? '4' : this.$store.rootState.location.userFias.fias_level,
      // // fias_id: onlyCity ? this.$store.rootState.location.selectedCity.fias_id : this.$store.rootState.location.userFias.fias_id,
      // ...(onlyCity ? {} : this.$store.rootState.location.userStreet),
      // ...(onlyCity ? {} : this.$store.rootState.location.userHouse)
    }
    const sort: DEALS_SORT_TYPES = this.$store.rootState.filters.sort

    const stringyfiedParams = JSON.stringify({
      params: { ...params },
      location,
      sort
    })
    try {
      if (this.savedDeals === stringyfiedParams && !this.errorDeals) {
        return
      }
      if (!params) {
        throw new Error('Filters error')
      }
      this._loading = true
      await Vue.nextTick()
      this.savedDeals = stringyfiedParams

      const filters: FilterOption[] = this.$store.rootGetters['filters/filterWithValues']

      this.locationHaveDeals = await this.$store
        .dispatch('filters/PreflightFiltersForLocation', location, { root: true }) ?? this.locationHaveDeals
      await Vue.nextTick()
      const { count, results, exists_more, providers_count } = await api.deals.GetDeals(
        location,
        filters,
        sort
      )

      await this.GetAddsForDeals(results)

      this.errorDeals = false

      this._deals = [...results]
      this._dealsCount = count
      this._providersCount = providers_count
      this.nextPage = exists_more
    } catch (e) {
      this._dealsCount = 0
      this._providersCount = 0
      this.errorDeals = true
      this._deals = []
    } finally {
      this._loading = false
    }
  }

  @action async GetNextDeals (onlyCity: boolean) {
    if (this.loadingMore || this.loading || this.loadedAll || !this.nextPage) {
      return
    }
    this._loadingMore = true
    try {
      const location: {city_fias_id: string, house_id?: string} = {
        city_fias_id: this.$store.rootState.location.selectedCity.fias_id,
        ...(onlyCity ? {} : { house_id: this.$store.rootState.location.userHouse.house_id })
      }
      const filters: FilterOption[] = this.$store.rootGetters['filters/filterWithValues']
      const sort: DEALS_SORT_TYPES = this.$store.rootState.filters.sort
      const { results, exists_more } = await api.deals.GetDeals(
        location,
        filters,
        sort,
        this.deals.length
      )
      await this.GetAddsForDeals(results)
      this.nextPage = exists_more
      this.ADD_DEALS(results)
    } catch (e) {
      // TODO: Add handler
    } finally {
      this._loadingMore = false
    }
  }

  @action async GetAddsForDeals (deals: IDealItem[]) {
    const tvPackagesIDs = deals.map((deal) => {
      const service = deal.services.find(serv => serv.service_type === DEAL_SERVICE_TYPE.TV) as ServiceTv|undefined
      if (!service) {
        return []
      }
      return service.packages_use.map(el => el.package)
    }).flat().filter((el, i, arr) => arr.indexOf(el) === i)
    const deviceIDs = deals.map(deal => deal.device_use.map(device => device.device)).flat()

    const tvPackageData = this.$store.dispatch('tvPackage/GetByID', tvPackagesIDs, { root: true })
    const deviceData = this.$store.dispatch('device/GetByID', deviceIDs, { root: true })

    return Promise.all([
      tvPackageData,
      deviceData
    ])
  }

  @action async GetLocationProviders () {
    const data = await api.deals.DealsCountByProvider(this.$store.rootState.location.selectedCity.fias_id)
    this.ADD_LOCATION_PROVIDERS(data)
  }

  @action async GetBestOffers () {
    const filters: FilterOption[] = [
      {
        id: 'service__service_type',
        name: 'Тип',
        type: 'radio',
        sort: 0,
        value: TARIFF_PACKET_TYPE.INTERNET,
        variants: []
      }
    ]

    const { results } = await api.deals.GetDeals(
      { city_fias_id: this.$store.rootGetters['location/fullLocationState'].cityFias_id },
      filters,
      DEALS_SORT_TYPES.COST_CHEAP,
      0,
      9
    )
    this.SET_BEST_OFFERS(results || [])
  }

  @mutation SET_BEST_OFFERS (items: IDealItem[]) {
    this.bestOffers = [...items]
  }

  @action async GetBestOffersTV () {
    const filters: FilterOption[] = [
      {
        id: 'service__service_type',
        name: 'Тип',
        type: 'radio',
        sort: 0,
        value: TARIFF_PACKET_TYPE.INTERNET_TV,
        variants: []
      }
    ]

    const { results } = await api.deals.GetDeals(
      { city_fias_id: this.$store.rootGetters['location/fullLocationState'].cityFias_id },
      filters,
      DEALS_SORT_TYPES.COST_CHEAP,
      0,
      9
    )
    this.SET_BEST_OFFERS_TV(results || [])
  }

  @mutation SET_BEST_OFFERS_TV (items: IDealItem[]) {
    this.bestOffersTV = [...items]
  }

  @mutation ADD_LOCATION_PROVIDERS (list: Record<IProvider['SourceID'], number>) {
    this.locationProviders = list
  }

  @mutation ADD_DEALS (payload: IDealItem[]) {
    this._deals = [...this._deals, ...payload]
  }

  get dealById () {
    return (id: IDealItem['id']) => this._deals.find(el => el.id === id)
  }

  get loadedAll () {
    return !this.nextPage
  }

  get dealsCount () {
    return this._dealsCount
  }

  set dealsCount (val) {
    this._dealsCount = val
  }

  get providersCount () {
    return this._providersCount
  }

  set providersCount (val) {
    this._providersCount = val
  }

  get loading () {
    return this._loading
  }

  set loading (val) {
    this._loading = val
  }

  get deals () {
    return this._deals
  }

  get loadingMore () {
    return this._loadingMore
  }

  set loadingMore (val) {
    this._loadingMore = val
  }
}

export function getBestOffers (): IDealItem[] {
  return [
    {
      id: 2234,
      technology: [
        'GPON'
      ],
      price: 250,
      price_norm: 400,
      name: 'Для улетного настроения',
      content: '<p><strong>&laquo;Для улётного настроения&raquo;</strong> (Акция) - возможность для физических лиц, не являющихся абонентами услуги Домашний Интернет, однократно подключить при технической возможности Домашний интернет по тарифу &laquo;Для улётного настроения&raquo; на условиях Акции&nbsp;по сниженной цене на время промо-периода. Для участии в Акции необходимо&nbsp; внести авансовый платёж, равный 4-м месяцам пользования услугой&nbsp;с учётом скидки.</p>',
      provider: 1,
      attributes: [
        {
          key: 'prepaid_payment',
          name: 'Авансовый платёж',
          rate: 10,
          units2: 'абон. плат',
          value2: '4',
          internal: false,
          group_key: null,
          group_name: 'Условия подключения',
          description: ''
        },
        {
          key: 'contract',
          name: 'Обязательный контракт',
          rate: 0,
          units: 'мес',
          value: '12',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок обязательного пользования ТП'
        },
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '4',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        },
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        }
      ],
      benefits: [
        {
          rate: 30,
          text: 'Максимальный интернет-минимальная цена',
          group_key: null,
          group_name: 'Оффер'
        }
      ],
      services: [
        {
          speed: 200,
          units: 'Мбит/с',
          packages_use: [

          ],
          service_type: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'GPON'
          ],
          services: [
            1,
            2
          ],
          cost: 4500,
          cost_norm: null,
          monthly_payment: 10,
          single_payment: null,
          installment_period: null,
          display: 'Оптический модем с WI-FI (Medium) Аренда 10 руб/мес.',
          device: 4,
          method: 2
        }
      ],
      device_use_default_idx: 0
    },
    {
      id: 182,
      technology: [
        'FTTB'
      ],
      price: 350,
      price_norm: null,
      name: 'Эксклюзивный 2.0',
      content: '<p>Акция&nbsp;<strong>&laquo;Больше, чем интернет&raquo;</strong></p>\r\n\r\n<p>С момента подключения и до 09.12.2020 в тариф включён ТВ пакет&nbsp;&laquo;Wifire TV Mobile&raquo; (более 120 каналов) для просмотра в приложении&nbsp;<strong>&quot;Wifire TV&quot;</strong></p><p><strong>Wi-fi роутер</strong>&nbsp;включён&nbsp;в рассрочку. При отказе стоимость не меняется.</p>',
      provider: 4,
      attributes: [
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        }
      ],
      benefits: [
        {
          rate: 100,
          text: 'Хорошая скорость-отличная цена!',
          group_key: null,
          group_name: 'Оффер'
        },
        {
          rate: 100,
          text: 'Тариф без обязательств, акций и контрактов.',
          group_key: null,
          group_name: 'Оффер'
        },
        {
          rate: 0,
          text: 'Более 120 каналов в приложении Wifire TV Mobile',
          group_key: null,
          group_name: 'Бесплатные услуги'
        }
      ],
      services: [
        {
          speed: 50,
          units: 'Мбит/с',
          packages_use: [

          ],
          service_type: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 2400,
          cost_norm: null,
          monthly_payment: null,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Low) Включен в тариф',
          device: 28,
          method: 1
        }
      ],
      device_use_default_idx: 0
    },
    {
      id: 5030,
      technology: [
        'FTTB'
      ],
      price: 440,
      price_norm: null,
      name: 'Технологии доступа',
      content: '<p><strong>Акция &quot;Рассрочка по цене аренды&quot;</strong></p>\r\n\r\n<p>Роутер (Low) предоставлен&nbsp;в рассрочку на 36 мес. по 30 руб./мес.&nbsp;</p><p><strong>Авансовый платёж</strong> необходимо внести в течение 3-х дней с момента подключения услуг.</p>\r\n\r\n<p>Списание <strong>авансового платежа</strong> произойдёт в первый расчётный период.&nbsp;&nbsp;</p>\r\n\r\n<p><strong>Стоимость подключения (при её наличии)</strong>&nbsp;входит в <strong>авансовый платёж</strong>&nbsp;и дополнительно не вносится.</p>\r\n\r\n<p>&nbsp;</p>',
      provider: 1,
      attributes: [

      ],
      benefits: [
        {
          rate: 0,
          text: 'Бесплатно настроим Ваш роутер',
          group_key: null,
          group_name: 'Оборудование'
        },
        {
          rate: 0,
          text: 'ТВ в приложении Wink',
          group_key: null,
          group_name: 'Бесплатные услуги'
        },
        {
          rate: 0,
          text: 'Яндекс.Диск +5 Gb',
          group_key: null,
          group_name: 'Бесплатные услуги'
        }
      ],
      services: [
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [

          ],
          service_type: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 4080,
          cost_norm: null,
          monthly_payment: 30,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Medium) Аренда 30 руб/мес.',
          device: 5,
          method: 2
        }
      ],
      device_use_default_idx: 0
    }
  ]
}

export function getBestOffersTV (): IDealItem[] {
  return [
    {
      id: 2260,
      technology: [
        'FTTB'
      ],
      price: 400,
      price_norm: 800,
      name: 'Хит',
      content: '<p>При подключении и переходе на тарифы линейки&nbsp;Объединяй!,&nbsp;до 30 ноября 2020 г. получите <span style="color:#ff0000"><strong>скидку </strong></span>50% на абонентскую плату.</p>\r\n\r\n<p><strong>Важно: Для активации скидки необходимо внести авансовый платёж равный полной стоимости ТП без учёта скидки + оплату за оборудование!&nbsp;</strong></p>\r\n\r\n<ul>\r\n\t<li>1&nbsp;месяц для всех наших клиентов и&nbsp;клиентов Wifire (НэтбайНэт) при переходе на&nbsp;тарифы линейки&nbsp;Объединяй!;</li>\r\n\t<li>3&nbsp;месяца, если вы&nbsp;новый клиент Wifire,&nbsp;новый клиент МегаФона или&nbsp;вы новый клиент и ранее не пользовались услугами Wifire и МегаФона</li>\r\n</ul>',
      provider: 4,
      attributes: [
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '3',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        }
      ],
      benefits: [
        {
          rate: 100,
          text: 'Мобильная связь, домашний интернет и ТВ в одном тарифе',
          group_key: null,
          group_name: 'Оффер'
        },
        {
          rate: 0,
          text: 'Самый быстрый мобильный интернет в стране',
          group_key: null,
          group_name: 'Моб. связь'
        },
        {
          rate: 0,
          text: 'Безлимит на звонки в сети Мегафон по всей России',
          group_key: null,
          group_name: 'Моб. связь'
        }
      ],
      services: [
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [

          ],
          service_type: 1
        },
        {
          channels_count: 157,
          packages_use: [
            {
              included: true,
              surcharge: null,
              channels_count: 157,
              hd_channels_count: 6,
              package: 51
            }
          ],
          service_type: 2,
          packages_use_default_index: 0
        },
        {
          packages_use: [

          ],
          gigabytes: 999,
          minutes: 1300,
          service_type: 4,
          sim_count: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            2
          ],
          cost: 4990,
          cost_norm: null,
          monthly_payment: null,
          single_payment: null,
          installment_period: null,
          display: 'ТВ приставка Включен в тариф',
          device: 2,
          method: 1
        }
      ],
      device_use_default_idx: 0
    },
    {
      id: 6374,
      technology: [
        'FTTB'
      ],
      price: 250,
      price_norm: 400,
      name: 'Летняя акция 2020',
      content: '<p><strong>Оборудование</strong> включёно в стоимость тарифа на условиях аренды. При отказе стоимость не меняется.</p><p>Стоимость указана с учётом <span style="color:#ff0000"><strong>скидки</strong></span> в промо-период. После промо-периода стоимость возвратиться на базовое значение&nbsp;</p>',
      provider: 48,
      attributes: [
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        },
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '3',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        }
      ],
      benefits: [],
      services: [
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [],
          service_type: 1
        },
        {
          channels_count: 91,
          packages_use: [
            {
              included: false,
              surcharge: 40,
              channels_count: 138,
              hd_channels_count: 23,
              package: 69
            },
            {
              included: false,
              surcharge: 124,
              channels_count: 97,
              hd_channels_count: 14,
              package: 70
            },
            {
              included: true,
              surcharge: 0,
              channels_count: 91,
              hd_channels_count: 12,
              package: 68
            }
          ],
          service_type: 2,
          packages_use_default_index: 2
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 2500,
          cost_norm: null,
          monthly_payment: null,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Low) Включен в тариф',
          device: 20,
          method: 1
        }
      ],
      device_use_default_idx: 0
    },
    {
      id: 6374,
      technology: [
        'FTTB'
      ],
      price: 250,
      price_norm: 400,
      name: 'Летняя акция 2020',
      content: '<p><strong>Оборудование</strong> включёно в стоимость тарифа на условиях аренды. При отказе стоимость не меняется.</p><p>Стоимость указана с учётом <span style="color:#ff0000"><strong>скидки</strong></span> в промо-период. После промо-периода стоимость возвратиться на базовое значение&nbsp;</p>',
      provider: 48,
      attributes: [
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        },
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '3',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        }
      ],
      benefits: [],
      services: [
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [],
          service_type: 1
        },
        {
          channels_count: 91,
          packages_use: [
            {
              included: false,
              surcharge: 40,
              channels_count: 138,
              hd_channels_count: 23,
              package: 69
            },
            {
              included: false,
              surcharge: 124,
              channels_count: 97,
              hd_channels_count: 14,
              package: 70
            },
            {
              included: true,
              surcharge: 0,
              channels_count: 91,
              hd_channels_count: 12,
              package: 68
            }
          ],
          service_type: 2,
          packages_use_default_index: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 2500,
          cost_norm: null,
          monthly_payment: null,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Low) Включен в тариф',
          device: 20,
          method: 1
        }
      ],
      device_use_default_idx: 0
    },
    {
      id: 7021,
      technology: [
        'FTTB'
      ],
      price: 489,
      price_norm: 650,
      name: 'Технологии развлечения',
      content: '<p><strong>Акция &laquo;Включайте выгоду&raquo;</strong>, в рамках акции первые 2 месяца&nbsp;в тариф включён пакет телеканалов&nbsp;<strong>&laquo;Трансформер&raquo; за 99 руб./мес.&nbsp;</strong>По окончании&nbsp;2-х месяцев переход&nbsp;на базовую стоимость пакета телеканалов <strong>&laquo;Трансформер&raquo;</strong>.</p><p>Стоимость указана с учётом <span style="color:#ff0000"><strong>скидки</strong></span> в промо-период. После промо-периода стоимость возвратиться на базовое значение&nbsp;</p>',
      provider: 1,
      attributes: [
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '2',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        },
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        }
      ],
      benefits: [
        {
          rate: 30,
          text: 'Интернет и ТВ по минимальной цене',
          group_key: null,
          group_name: 'Оффер'
        },
        {
          rate: 0,
          text: 'Эксклюзивный канал UFC',
          group_key: null,
          group_name: 'ТВ'
        },
        {
          rate: 0,
          text: 'Смотри ТВ без приставок',
          group_key: null,
          group_name: 'ТВ'
        }
      ],
      services: [
        {
          channels_count: 175,
          packages_use: [
            {
              included: false,
              surcharge: 1420,
              channels_count: 279,
              hd_channels_count: 77,
              package: 4
            },
            {
              included: false,
              surcharge: 280,
              channels_count: 240,
              hd_channels_count: 53,
              package: 5
            },
            {
              included: true,
              surcharge: 0,
              channels_count: 175,
              hd_channels_count: 39,
              package: 64
            }
          ],
          service_type: 2,
          packages_use_default_index: 2
        },
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [],
          service_type: 1
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 4080,
          cost_norm: null,
          monthly_payment: 30,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Medium) Аренда 30 руб/мес.',
          device: 5,
          method: 2
        },
        {
          description: '',
          techs: [
            'АDSL',
            'GPON',
            'FTTB'
          ],
          services: [
            2
          ],
          cost: 3990,
          cost_norm: null,
          monthly_payment: 10,
          single_payment: null,
          installment_period: null,
          display: 'ТВ приставка Wink Аренда 10 руб/мес.',
          device: 10,
          method: 2
        }
      ],
      device_use_default_idx: 1
    },
    {
      id: 7192,
      technology: [
        'FTTB'
      ],
      price: 549,
      price_norm: 650,
      name: 'Технологии развлечения',
      content: '<p><strong>Акция &laquo;Включайте выгоду&raquo;</strong>, в рамках акции первые 3 месяца (месяц подключения + 2 полных месяца) в тариф включён пакет телеканалов&nbsp;<strong>&laquo;Трансформер&raquo; за 99 руб./мес.&nbsp;</strong>По окончании&nbsp;3-х месяцев переход&nbsp;на базовую стоимость пакета телеканалов <strong>&laquo;Трансформер&raquo;</strong>.</p><p><strong>Авансовый платёж</strong> необходимо внести в течение 3-х дней с момента подключения услуг.</p>\r\n\r\n<p>Списание <strong>авансового платежа</strong> произойдёт в первый расчётный период.&nbsp;&nbsp;</p>\r\n\r\n<p><strong>Стоимость подключения (при её наличии)</strong>&nbsp;входит в <strong>авансовый платёж</strong>&nbsp;и дополнительно не вносится.</p>\r\n\r\n<p>&nbsp;</p><p><strong>Смотри ТВ без приставок</strong></p>\r\n\r\n<p>Телевизоры с поддержкой функции SmartTV (Tizen, WebOS, Orsay, Android TV) могут быть подключены без использования ТВ приставки.&nbsp;</p>',
      provider: 1,
      attributes: [
        {
          key: 'promo',
          name: 'Акция',
          rate: 0,
          internal: false,
          group_key: 'tags',
          group_name: 'Теги',
          description: ''
        },
        {
          key: 'promo_period',
          name: 'Промо-период',
          rate: 0,
          units: 'мес',
          value: '3',
          internal: false,
          group_key: null,
          group_name: 'Ограничения тарифов',
          description: 'Срок действия особых условий по тарифу.'
        }
      ],
      benefits: [
        {
          rate: 25,
          text: 'Интернет, ТВ и ничего лишнего',
          group_key: null,
          group_name: 'Оффер'
        },
        {
          rate: 0,
          text: 'Эксклюзивный канал UFC',
          group_key: null,
          group_name: 'ТВ'
        },
        {
          rate: 0,
          text: 'Смотри ТВ без приставок',
          group_key: null,
          group_name: 'ТВ'
        }
      ],
      services: [
        {
          speed: 100,
          units: 'Мбит/с',
          packages_use: [],
          service_type: 1
        },
        {
          channels_count: 175,
          packages_use: [
            {
              included: false,
              surcharge: 1420,
              channels_count: 279,
              hd_channels_count: 77,
              package: 4
            },
            {
              included: false,
              surcharge: 280,
              channels_count: 240,
              hd_channels_count: 53,
              package: 5
            },
            {
              included: true,
              surcharge: 0,
              channels_count: 175,
              hd_channels_count: 39,
              package: 64
            }
          ],
          service_type: 2,
          packages_use_default_index: 2
        }
      ],
      device_use: [
        {
          description: '',
          techs: [
            'FTTB'
          ],
          services: [
            1,
            2
          ],
          cost: 4080,
          cost_norm: null,
          monthly_payment: 30,
          single_payment: null,
          installment_period: null,
          display: 'WI-FI Роутер (Medium) Аренда 30 руб/мес.',
          device: 5,
          method: 2
        },
        {
          description: '',
          techs: [
            'АDSL',
            'GPON',
            'FTTB'
          ],
          services: [
            2
          ],
          cost: 3990,
          cost_norm: null,
          monthly_payment: 30,
          single_payment: null,
          installment_period: null,
          display: 'ТВ приставка Wink Аренда 30 руб/мес.',
          device: 10,
          method: 2
        }
      ],
      device_use_default_idx: 0
    }
  ]
}
