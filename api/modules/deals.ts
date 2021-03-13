import { BaseApi } from '~/api/BaseApi'
import { LocationProvidersPromise } from '~/types/api'
import { DEALS_SORT_TYPES, IDealItem } from '~/types/deals'
import { FilterLocationData, FilterOption, FilterRequestDTO, TARIFF_PACKET_TYPE } from '~/types/filters'
import { ISelectedCity } from '~/types/location'

export class DealsApi extends BaseApi {
  async GetDeals (
    location: FilterLocationData,
    filters: FilterOption[],
    sort: DEALS_SORT_TYPES,
    offset = 0,
    limit = 10
  ): LocationProvidersPromise<IDealItem> {
    const dto = this.TransformFilters(location, filters, sort, offset, limit)
    const { data } = await this._axios.post('/location/tariffs/', dto)
    return data
  }

  async GetDealByAddressAndId (
    location: FilterLocationData,
    id: IDealItem['id']
  ): LocationProvidersPromise<IDealItem> {
    const filters: FilterOption[] = [{
      id: 'id',
      name: 'id',
      label: 'id',
      sort: 0,
      type: 'text',
      value: String(id)
    }]
    const dto = this.TransformFilters(location, filters, DEALS_SORT_TYPES.COST_CHEAP, 0, 10)
    const { data } = await this._axios.post('/location/tariffs/', dto)
    return data
  }

  async GetProviderByAddressAndId (
    location: FilterLocationData,
    id: IDealItem['id']
  ): LocationProvidersPromise<IDealItem> {
    const filters: FilterOption[] = [{
      id: 'provider__in',
      name: 'provider__in',
      label: 'provider__in',
      sort: 0,
      type: 'text',
      value: `${id}`
    }]
    const dto = this.TransformFilters(location, filters, DEALS_SORT_TYPES.COST_CHEAP, 0, 10)
    const { data } = await this._axios.post('/location/tariffs/', dto)
    return data
  }

  async DealsCountByProvider (fias_id: ISelectedCity['fias_id']): Promise<Record<string, number>> {
    const { data } = await this._axios.post('/location-providers/city/', { fias_id })
    return data
  }

  private TransformFilters (
    location: {cityFias_id?:string, city_fias_id: string, house_id?: string},
    filters: FilterOption[],
    sort: DEALS_SORT_TYPES,
    offset = 0,
    limit = 10
  ): FilterRequestDTO {
    const filter_include: Record<string, any> = {}
    const filter_exclude: Record<string, any> = {}
    filters.forEach((filter) => {
      if ((Array.isArray(filter.value) && !filter.value.length) || (!Array.isArray(filter.value) && !filter.value)) {
        return
      }
      if (filter.id === 'service__service_type') {
        const valueResolver = (value: number) => {
          switch (Number(value)) {
            case TARIFF_PACKET_TYPE.ALL: return undefined
            case TARIFF_PACKET_TYPE.INTERNET: return [1]
            case TARIFF_PACKET_TYPE.INTERNET_CELLULAR: return [1, 4]
            case TARIFF_PACKET_TYPE.INTERNET_TV: return [1, 2]
            case TARIFF_PACKET_TYPE.INTERNET_TV_CELLULAR: return [1, 2, 4]
            case TARIFF_PACKET_TYPE.TV: return [2]
            case TARIFF_PACKET_TYPE.CCTV: return [1, 5]
            default: return undefined
          }
        }
        const value = ([filter?.value].flat() as any[] || []).map(valueResolver).filter(Boolean)
        if (!value.length) {
          return
        }
        filter_include.services__in = value

        return
      }
      if (filter.id === 'tv_box_count') {
        if (filter.value === '0') {
          return
        }
      }
      if (filter.id === 'deviceuse__device') {
        if (filter.value === 'true') {
          filter_include.deviceuse__device__in = [1]
        }
        return
      }
      if (filter.id === 'min_contract') {
        filter_include.attribute__data__key = 'contract'
        filter_include.attribute__data__value__in = [filter.value ?? []].flat()
        return
      }
      switch (filter.type) {
        case 'range': {
          filter_include[`${filter.id}__lte`] = (filter.value ?? [])[1]
          filter_include[`${filter.id}__gte`] = (filter.value ?? [])[0]
          break
        }
        case 'text':
        case 'number': {
          filter_include[filter.id] = filter.value
          break
        }
        case 'checkbox':
        case 'checkbox_image': {
          const values = [filter.value]
            .flat()
            .filter(Boolean)
            .map((el) => {
              try {
                return Number(el)
              } catch (e) {
                return el
              }
            })
          if (values.length) {
            filter_include[`${filter.id}__in`] = values
          }
          break
        }
        case 'radio': {
          if (filter.boolean && filter.value !== undefined) {
            filter_include[filter.id] = filter.value === 'true'
            break
          }
          if (filter.value) {
            filter_include[filter.id] = filter.value
          }
          break
        }
        case 'select': {
          if (filter.value) {
            filter_include[filter.id] = filter.value
          }
          break
        }
      }
    })
    const city_fias_id: string | undefined = location.city_fias_id || location.cityFias_id!
    const onlyCity = !location.house_id
    return {
      city_fias_id,
      ...(onlyCity ? {} : { house_id: this._vuex.location.userHouse.house_id }),
      filter_include,
      filter_exclude,
      offset,
      limit,
      sort: [sort]
    }
  }

  async GetBestOffers (
    location: FilterLocationData
  ): Promise<void> {
    const dto = { location }
    // const { data } = await this._axios.post('/#/', dto)
    await new Promise(resolve => setTimeout(resolve, 1500, dto))
  }
}
