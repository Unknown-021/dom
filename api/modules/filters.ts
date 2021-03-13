import api from '~/api'
import { BaseApi } from '~/api/BaseApi'
import { cmsImg } from '~/plugins/cms'
import { CheckboxFilterOption, CheckboxImageFilterOption, FilterOption, RangeFilterOption, TARIFF_PACKET_TYPE } from '~/types/filters'

export class FiltersApi extends BaseApi {
  async filtersOptions (): Promise<FilterOption[]> {
    const filters: Promise<FilterOption>[] = [
      this.TypesFilter(),
      this.ProvidersFilter(),
      this.PriceFilter(),
      this.SpeedFilter(),
      this.MinContractFilter(),
      this.DeviceUseFilter(),
      ...this.AdditionalFilters().map(el => Promise.resolve(el))
    ]

    return Promise.all(filters).then(data => data.sort((a, b) => a.sort - b.sort))
  }

  async TypesFilter (): Promise<CheckboxFilterOption> {
    return {
      id: 'service__service_type',
      name: '',
      type: 'checkbox',
      sort: 0,
      options: {
        fullwidth: true
      },
      variants: [
        {
          id: TARIFF_PACKET_TYPE.INTERNET,
          name: 'Интернет'
        },
        {
          id: TARIFF_PACKET_TYPE.INTERNET_TV,
          name: 'Интернет+ТВ'
        },
        {
          id: TARIFF_PACKET_TYPE.TV,
          name: 'ТВ'
        },
        {
          id: TARIFF_PACKET_TYPE.INTERNET_CELLULAR,
          name: 'Интернет+Связь'
        },
        {
          id: TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR,
          name: 'Интернет+ТВ+Связь'
        },
        {
          id: TARIFF_PACKET_TYPE.CCTV,
          name: 'Видеонаблюдение'
        }
      ],
      value: []
    }
  }

  async ProvidersFilter (): Promise<CheckboxImageFilterOption> {
    const providers = (await api.strapiProvidersApi.GetAll()).results
    return {
      id: 'provider',
      name: 'Провайдеры',
      sort: 10,
      type: 'checkbox_image',
      value: [],
      variants: providers.map(({ id, Name, FilterAndTariffHeaderLogo }) => ({
        id,
        name: Name,
        image: cmsImg(FilterAndTariffHeaderLogo?.url || '')
      }))
    }
  }

  async PriceFilter (): Promise<RangeFilterOption> {
    return {
      id: 'price',
      name: 'Цена в месяц',
      sort: 20,
      type: 'range',
      measure: 'мес',
      unit: 'руб',
      max: 1500,
      min: 100,
      value: [100, 1500]
    }
  }

  async SpeedFilter (): Promise<RangeFilterOption> {
    return {
      id: 'service__speed',
      name: 'Скорость',
      sort: 30,
      enabled: {
        service__service_type: ['in', [
          TARIFF_PACKET_TYPE.ALL,
          TARIFF_PACKET_TYPE.INTERNET,
          TARIFF_PACKET_TYPE.INTERNET_CELLULAR,
          TARIFF_PACKET_TYPE.INTERNET_TV,
          TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR,
          TARIFF_PACKET_TYPE.CCTV
        ]]
      },
      type: 'range',
      measure: 'сек',
      unit: 'Мбит',
      min: 10,
      max: 400,
      value: [10, 400],
      hint: '100 Мбит/сек подходит для базовых задач и подключения до 4 устройств по Wi-Fi. 500 Мбит/сек подходит для онлайн-игр, просмотра видео в 4K и подключения до 10 устройств по Wi-Fi.'
    }
  }

  async MinContractFilter (): Promise<CheckboxFilterOption> {
    return {
      id: 'min_contract',
      name: 'Минимальный контракт',
      sort: 40,
      type: 'checkbox',
      value: [],
      variants: [
        {
          id: 1,
          name: '1 месяц'
        },
        {
          id: 12,
          name: '12 месяцев'
        },
        {
          id: 18,
          name: '18 месяцев'
        }
      ],
      hint: 'У всех тарифов указан минимальный срок, на который вы можете заключить договор.У большинства тарифов — это 1 месяц, но есть и исключения. Учитывайте это при выборе тарифов.'
    }
  }

  async DeviceUseFilter (): Promise<CheckboxFilterOption> {
    return {
      id: 'deviceuse__method',
      name: 'Условия по оборудованию',
      type: 'checkbox',
      options: {
        fullwidth: true
      },
      value: [],
      sort: 60,
      variants: (await api.devicePaymentMethods.GetAll()).results.map(({ id, name }) => ({
        id, name
      })),
      hint: 'Выберите тарифы с нужными вам условиями предоставления роутера и ТВ-приставки.'
    }
  }

  AdditionalFilters (): FilterOption[] {
    return [
      {
        id: 'deviceuse__device',
        name: 'Роутер',
        type: 'radio',
        sort: 25,
        enabled: {
          service__service_type: ['in', [
            TARIFF_PACKET_TYPE.ALL,
            TARIFF_PACKET_TYPE.INTERNET,
            TARIFF_PACKET_TYPE.INTERNET_CELLULAR,
            TARIFF_PACKET_TYPE.INTERNET_TV,
            TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR,
            TARIFF_PACKET_TYPE.CCTV
          ]]
        },
        value: '',
        variants: [
          {
            id: 'true',
            name: 'Нужен'
          },
          {
            id: 'false',
            name: 'Не нужен'
          }
        ]
      },
      {
        id: 'tv_box_count',
        name: 'ТВ-приставка',
        type: 'select',
        enabled: {
          service__service_type: ['in', [
            TARIFF_PACKET_TYPE.ALL,
            TARIFF_PACKET_TYPE.INTERNET_TV,
            TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR,
            TARIFF_PACKET_TYPE.TV
          ]]
        },
        sort: 50,
        variants: Array(3).fill(1).map((_, i) => ({ id: `${i}`, name: `${i}` })),
        hint: 'Если телевизор поддерживает технологию Smart-TV или у вас уже есть приставка (Apple TV или Android), то вы можете обойтись без нее. В остальных случаях вам нужна ТВ-приставка.'
      },
      {
        id: 'install_payment',
        name: 'Подключение',
        type: 'radio',
        sort: 70,
        boolean: true,
        value: '',
        variants: [
          {
            id: 'true',
            name: 'Платно'
          },
          {
            id: 'false',
            name: 'Бесплатно'
          }
        ],
        hint: 'Оплата за подключение может взиматься некоторыми провайдерами. «Доминтернет» — бесплатный сервис.'
      },
      {
        id: 'credit_payment',
        name: 'Метод оплаты',
        type: 'radio',
        sort: 80,
        boolean: true,
        value: '',
        variants: [
          {
            id: 'false',
            name: 'Предоплата'
          },
          {
            id: 'true',
            name: 'Постоплата'
          }
        ],
        hint: 'Предоплата — вы оплачиваете абонентскую плату при фактическом подключении. Постоплата — вы оплачиваете абонентскую плату после окончания расчетного периода.'
      }
    ]
  }
}
