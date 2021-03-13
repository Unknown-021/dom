import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { DomApiPromise } from '~/types/api'
import { CmsDeviceDetail } from '~/types/device'
import { IDevice } from '~/types/providers'

export class DeviceApi extends DictionaryApiFactory<CmsDeviceDetail, 'SourceID'>() {
  async GetAll (): DomApiPromise<CmsDeviceDetail> {
    const response = await this._axios.get('/')
    const results = await { results: response.data, exists_more: false, count: response.data.length }
    return results
  }

  GetById (ids: number[]): Promise<CmsDeviceDetail[]>;
  GetById (ids: number): Promise<CmsDeviceDetail>;
  async GetById (ids: number[] | number) {
    if (Array.isArray(ids)) {
      const { data } = await this._axios.get('/', {
        params: {
          SourceID_in: ids
        }
      })
      return data
    }
    const { data } = await this._axios.get('/', {
      params: {
        SourceID: ids
      }
    })

    return data[0]
  }

  async GetFilters (filters: Partial<IDevice>) {
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
