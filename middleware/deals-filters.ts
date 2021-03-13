import { Middleware } from '@nuxt/types'
/**
 * Заполняем стор значениями фильтра из query параметров
 * Если стоят не все обязательные фильтры - принудительно редиректим на страницу с дефолтными
 *
 * К этому моменту стор с адресом должен быть заполнен, иначе будет приключение с дебагером
 */

const dealsMiddleware: Middleware = async ({ $vuex, query, req, route, redirect }) => {
  if (!req) {
    if (JSON.stringify(query) !== JSON.stringify($vuex.filters.filtersQueryParams)) {
      await $vuex.filters.ParseQueryToFilterValues(query)
      return redirect({
        name: route?.name || '',
        params: route.params,
        query: $vuex.filters.filtersQueryParams
      })
    }
  }

  if (req) {
    await $vuex.filters.ParseQueryToFilterValues(query)
    if (JSON.stringify($vuex.filters.filtersQueryParams) !== JSON.stringify(query)) {
      return redirect({ query: $vuex.filters.filtersQueryParams })
    }
  }
}

export default dealsMiddleware
