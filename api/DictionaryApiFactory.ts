
import { AxiosAdapter, AxiosResponse } from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions'
import { BaseApi } from '~/api/BaseApi'
import { DictionaryApiModule, DomApiPromise, DomApiResponseBase } from '~/types/api'

export function DictionaryApiFactory<T, K extends keyof T, F extends keyof T = K> () {
  class DictionaryApi extends BaseApi implements DictionaryApiModule<T, K, F> {
    constructor (...args: ConstructorParameters<typeof BaseApi>) {
      super(...args)
      this._axios.defaults.adapter = cacheAdapterEnhancer(this._axios.defaults?.adapter as AxiosAdapter)
    }

    async GetAll (): DomApiPromise<T> {
      let offset = 0
      const { data } = (await this._axios.get(`/?limit=1000&offset=${offset}`)) as AxiosResponse<DomApiResponseBase<T>>
      let exists_more = data.exists_more
      while (exists_more) {
        offset += 1000
        const { data: nextPage } = (await this._axios.get(`/?limit=1000&offset=${offset}`)) as AxiosResponse<DomApiResponseBase<T>>
        exists_more = nextPage.exists_more
        data.results = [...data.results, ...nextPage.results]
      }
      return data
    }

    async GetFilters (filters: Partial<Pick<T, F>>): DomApiPromise<T> {
      const { data } = await this._axios.get('/', {
        params: filters
      })
      return data
    }

    GetById (id: T[K]): Promise<T>;
    GetById (id: T[K][]): Promise<T[]>;
    async GetById (id: T[K]|T[K][]): Promise<T|T[]> {
      if (Array.isArray(id)) {
        if (!id.length) {
          return []
        }
        const { data } = await this._axios.get(`/${id.join(',')}/`)
        return [data].flat()
      }
      const { data } = await this._axios.get(`/${id}/`)
      return data
    }
  }
  return DictionaryApi
}
