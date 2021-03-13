import { SubscribeModule } from '~/subscribes'

export const FilterSubscribeModule: SubscribeModule = (vuex) => {
  ['ADD_FILTER_VALUE', 'REMOVE_FILTER_VALUE'].forEach((mutation) => {
    vuex.filters.$subscribe(`changed/${mutation}`, vuex.filters.ApplyChangedFilters)
  })
}
