import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'
import { FilterValues } from '~/store/filters'
import { FilterOption } from '~/types/filters'

type ChangedValue = { id: FilterOption['id']; value: FilterOption['value'] }

export class FiltersChangedStore extends createModule({
  target: 'nuxt',
  namespaced: 'changed'
}) {
  filterValues: FilterValues = {};
  removedFilters: string[] = []
  loadingNew = false;
  foundDeals = 0;
  findError = false

  @action async AddNewValue ({ id, value }: ChangedValue) {
    const needDelete = !value || await this.CheckNeedDeleteChanged({ id, value })
    if (needDelete) {
      this.REMOVE_FILTER_VALUE(id)
    } else {
      this.ADD_FILTER_VALUE({ id, value })
    }
  }

  @action private async CheckNeedDeleteChanged ({ id, value }: ChangedValue): Promise<boolean> {
    const mainStateValue = this.$store.rootState.filters.filterValues[id]
    if (!mainStateValue) {
      return false
    }
    return String(mainStateValue) === String(value)
  }

  @action async GetFiltersWithValues (): Promise<FilterOption[]> {
    return Object.entries(this.fullFiltersWithChanged).reduce((acc, [key, value]) => {
      if (
        this.$store.rootGetters['filters/isFilterEnabled'](key) &&
        ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value))
      ) {
        // @ts-expect-error
        acc.push({
          ...this.$store.rootState.filters.filterTypes[key],
          value
        })
      }
      return acc
    }, [] as FilterOption[])
  }

  @mutation private ADD_FILTER_VALUE ({ id, value }: ChangedValue) {
    const removedIndex = this.removedFilters.indexOf(id)
    if (removedIndex >= 0) {
      this.removedFilters.splice(removedIndex, 1)
    }
    Vue.set(this.filterValues, id, value)
  }

  @mutation private REMOVE_FILTER_VALUE (id: string) {
    if (id in this.filterValues) {
      Vue.delete(this.filterValues, id)
    } else if (this.removedFilters.includes(id)) {
      const delInd = this.removedFilters.indexOf(id)
      this.removedFilters.splice(delInd, 1)
    } else {
      this.removedFilters.push(id)
    }
  }

  @mutation private SET_LOADING (val: boolean) {
    this.loadingNew = val
  }

  @mutation private SET_FOUND (val: number) {
    this.foundDeals = val
  }

  @action async ApplyHandler () {
    this.CLEAR_CHANGED()
  }

  @mutation CLEAR_CHANGED () {
    this.foundDeals = 0
    this.loadingNew = false
    this.removedFilters = []
    Vue.set(this, 'filterValues', {})
  }

  get fullFiltersWithChanged (): FilterValues {
    const settedFilters = this.$store.rootState.filters.filterValues
    const filteredMainFilters = Object.entries(settedFilters).reduce((acc, [key, value]) => {
      if (!this.removedFilters.includes(key)) {
        acc[key] = value
      }
      return acc
    }, {} as FilterValues)
    return {
      ...filteredMainFilters,
      ...this.filterValues
    }
  }

  get haveChanged (): boolean {
    return !!Object.keys(this.filterValues).length || !!this.removedFilters.length
  }

  get values () {
    return this.filterValues
  }
}
