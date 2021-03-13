/* eslint-disable eqeqeq */
import Vue from 'vue'
import { action, createModule, createSubModule, mutation } from 'vuex-class-component'
import api from '~/api'
import { cmsImg } from '~/plugins/cms'
import { FiltersChangedStore } from '~/store/filtersChanged'
import { LocationProviderFilters } from '~/types/api'
import { DEALS_SORT_TYPES } from '~/types/deals'
import { FilterLocationData, FilterOption, RangeFilterOption } from '~/types/filters'
import { IProvider } from '~/types/providers'

function getFilterValueTransformer (key: FilterOption['type']) {
  switch (key) {
    case 'range':
    case 'number':
      return (i: any) => Number(i)
    case 'text':
      return (i: any) => String(i)
    default:
      return (i: any) => i
  }
}

export type FilterValues = Record<FilterOption['id'], FilterOption['value']>

export class FiltersStore extends createModule({
  target: 'nuxt',
  namespaced: 'filters'
}) {
  changed = createSubModule(FiltersChangedStore);

  defaultFilterValues: FilterValues = {};
  filterTypes: Record<FilterOption['id'], FilterOption> = {};
  filterValues: FilterValues = {};
  sort = DEALS_SORT_TYPES.COST_CHEAP;
  filtersShowAlwaysCount = 5;

  private locationFilters = ''

  @action async PreflightFiltersForLocation (location: FilterLocationData): Promise<boolean|undefined> {
    const stringLocation = JSON.stringify(location)
    if (stringLocation === this.locationFilters) {
      return
    }
    this.locationFilters = stringLocation
    const { filters_data, count } = await api.deals.GetDeals(
      location,
      [],
      DEALS_SORT_TYPES.COST_CHEAP,
      0,
      1
    )
    await this.SetCustomFilters(filters_data)
    return !!count
  }

  @action async InitFiltersList () {
    const filters = await api.filters.filtersOptions()
    filters.forEach((filter) => {
      this.SET_FILTER_VALUE(filter)
      if ((!Array.isArray(filter.value) && filter.value) || (Array.isArray(filter.value) && filter.value.length)) {
        Vue.set(this.defaultFilterValues, filter.id, filter.value)
      }
    })
    this.SET_FILTER_OPTIONS(filters)
    this.MERGE_FILTER_VALUES(this.defaultFilterValues)
  }

  @action async ApplyChangedFilters () {
    this.MERGE_FILTER_VALUES(this.changed.values)
    this.changed.removedFilters.forEach(id => this.SET_FILTER_VALUE({ id, value: undefined }))
    await this.changed.ApplyHandler()
  }

  @action async SetCustomFilters (payload: LocationProviderFilters) {
    const newOptions = Object.values(this.filterTypes).reduce((acc, filter) => {
      try {
        switch (filter.id) {
          case 'provider': {
            const providers: IProvider[] = payload.providers.map(el => this.$store.rootGetters['providers/byId'](el))
            acc.push(Object.assign({}, filter, {
              variants: providers.filter(Boolean).map(({ SourceID, Name, FilterAndTariffHeaderLogo }) => ({
                id: SourceID,
                name: Name,
                image: cmsImg(FilterAndTariffHeaderLogo?.url || '')
              }))
            }))
            break
          }
          case 'price': {
            acc.push(Object.assign({}, filter, {
              max: payload.max_price,
              min: payload.min_price,
              value: [payload.min_price, payload.max_price]
            } as Partial<RangeFilterOption>))
            const [currMin, currMax] = (this.filterValues.price as [number, number])
            const [defaultMin, defaultMax] = (this.defaultFilterValues.price as [number, number])
            this.SET_FILTER_VALUE({
              id: filter.id,
              value: [
                Math.max(currMin, payload.min_price ?? defaultMin),
                Math.min(currMax, payload.max_price ?? defaultMax)
              ]
            })
            break
          }
          case 'service__speed': {
            acc.push(Object.assign({}, filter, {
              max: payload.max_speed,
              min: payload.min__speed,
              value: [payload.min__speed, payload.max_speed]
            } as Partial<RangeFilterOption>))
            const [currMin, currMax] = (this.filterValues.service__speed as [number, number])
            const [defaultMin, defaultMax] = (this.defaultFilterValues.service__speed as [number, number])
            this.SET_FILTER_VALUE({
              id: filter.id,
              value: [
                Math.max(currMin, payload.min__speed ?? defaultMin),
                Math.min(currMax, payload.max_speed ?? defaultMax)
              ]
            })
            break
          }
          default: {
            acc.push(filter)
          }
        }
        return acc
      } catch (e) {
        return acc
      }
    }, [] as FilterOption[])
    return this.SET_FILTER_OPTIONS(newOptions)
  }

  @mutation SET_FILTER_OPTIONS (options: FilterOption[]) {
    const newOptions = options.reduce((acc, el) => {
      acc[el.id] = el
      return acc
    }, {} as Record<FilterOption['id'], FilterOption>)

    this.filterTypes = { ...newOptions }
  }

  @mutation SET_FILTER_VALUE ({ id, value }: Pick<FilterOption, 'id'|'value'>) {
    if (!(id in this.filterValues)) {
      Vue.set(this.filterValues, id, value)
    } else {
      this.filterValues[id] = value
    }
  }

  @mutation SET_SORT (val: DEALS_SORT_TYPES) {
    this.sort = val
  }

  @action async ParseQueryToFilterValues (params: Record<string, string | (string | null)[]>) {
    const normalizedParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (!(key in this.filterTypes)) {
        return acc
      }

      const Transformer = getFilterValueTransformer(this.filterTypes[key].type)

      acc[key] = Array.isArray(value)
        ? value.filter(Boolean).map(Transformer)
        : Transformer(value)

      return acc
    }, {} as FilterValues)

    if (JSON.stringify(normalizedParams) === JSON.stringify(this.filterValues)) {
      return
    }

    if (
      params.sort &&
      typeof params.sort === 'string' &&
      Object.values(DEALS_SORT_TYPES).includes(params.sort)
    ) {
      this.SET_SORT(params.sort as DEALS_SORT_TYPES)
    } else {
      this.SET_SORT(DEALS_SORT_TYPES.COST_CHEAP)
    }
    this.MERGE_FILTER_VALUES(normalizedParams)

    return Vue.nextTick()
  }

  @mutation MERGE_FILTER_VALUES (payload: FilterValues) {
    this.filterValues = {
      ...this.filterValues,
      ...payload
    }
  }

  get isFilterEnabled () {
    return (key: FilterOption['id']) => {
      const filter = this.filterTypes[key]
      if (!filter || !filter.enabled || !Object.values(filter.enabled).length) {
        return true
      }
      return Object.entries(filter.enabled).every(([key, [type, condition]]) => {
        const caseFilterValue = this.changed.filterValues[key] ?? this.filterValues[key]
        if (!caseFilterValue) {
          return false
        }
        switch (type) {
          case 'is': {
            return Array.isArray(caseFilterValue)
              ? caseFilterValue.some(el => el == condition)
              : caseFilterValue == condition
          }
          case 'not': {
            return Array.isArray(caseFilterValue)
              ? caseFilterValue.some(el => el != condition)
              : caseFilterValue != condition
          }
          case 'in': {
            // Monkey patch for typings
            if (!Array.isArray(condition)) {
              return false
            }
            return Array.isArray(caseFilterValue)
              ? condition.some(cond => !caseFilterValue.length || caseFilterValue.some(el => el == cond))
              : condition.some(cond => cond == caseFilterValue)
          }
          default: return false
        }
      })
    }
  }

  get notEmptyFilters (): FilterValues {
    return Object.entries(this.filterValues).filter(([_, value]) => {
      if (Array.isArray(value)) {
        return !!value.length
      }
      return Boolean(value)
    }).reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as FilterValues)
  }

  get filtersQueryParams () {
    const filters = Object.entries({
      ...this.defaultFilterValues,
      ...this.notEmptyFilters
    }).reduce((acc, [key, value]) => {
      if (!value) {
        return acc
      }
      acc[key] = Array.isArray(value)
        ? (value as (string|number)[]).map(String)
        : String(value)
      return acc
    }, {} as Record<string, string|string[]>)
    return {
      ...filters,
      sort: this.sort as string
    }
  }

  get filterWithValues (): FilterOption[] {
    return Object.entries(this.filterValues).reduce((acc, [key, value]) => {
      if (
        this.isFilterEnabled(key) &&
        ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value))
      ) {
        // @ts-expect-error
        acc.push({
          ...this.filterTypes[key],
          value
        })
      }
      return acc
    }, [] as FilterOption[])
  }

  get filtersHumanReadable () {
    // @ts-expect-error
    return Object.entries(this.notEmptyFilters).reduce((acc, [key, value]) => {
      const filter = this.filterTypes[key]
      const filterName = filter.name ? `${filter.name.toLocaleLowerCase()}: ` : ''
      switch (filter.type) {
        case 'text':
        case 'number':
          return [...acc, `${filterName}${value}`]
        case 'range':
          const [min, max] = (value as [number, number])
          return [...acc, `${filterName}от ${min} до ${max} ${filter.unit}/${filter.measure}`]
        case 'radio':
          if (filter.id === 'type') {
            return acc
          }
          return [...acc, `${filterName}${filter.variants.find(el => el.id == value)?.name}`]
        case 'checkbox':
        case 'checkbox_image':
          const selected = [(value as (string|number)[])]
            .flat()
            .map(el => filter.variants.find(v => v.id == el)?.name?.toLocaleLowerCase())
            .filter(Boolean)
            .join(', ')
          return [...acc, `${filterName}${selected}`]
        default: return acc
      }
    }, []).join('; ')
  }
}
