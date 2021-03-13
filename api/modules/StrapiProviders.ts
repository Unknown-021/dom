import { BaseApi } from '~/api/BaseApi'
import { DictionaryApiModule, DomApiPromise } from '~/types/api'
import { IProvider } from '~/types/providers'

export class StrapiProviders extends BaseApi implements DictionaryApiModule<IProvider, 'SourceID'> {
  protected _vuex!: any;

  async GetAll (): DomApiPromise<IProvider> {
    const response = await this._axios.get('/')
    const results = await { results: response.data, exists_more: false, count: response.data.length }
    return results
  }

  GetById (ids: number[]): Promise<IProvider[]>;
  GetById (ids: number): Promise<IProvider>;
  async GetById (ids: number[] | number) {
    if (Array.isArray(ids)) {
      return this._axios.get('/', {
        params: {
          SourceID_in: ids
        }
      })
    }
    const { data } = await this._axios.get('/', {
      params: {
        SourceID: ids
      }
    })

    return data[0]
  }

  async GetFilters (filters: Partial<IProvider>) {
    const { data } = await this._axios.get('/', {
      params: filters
    })
    return {
      results: data,
      count: data.length,
      exists_more: false
    }
  }
}
