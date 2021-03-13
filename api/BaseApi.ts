import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { axiosCache } from '~/api/cache'
import { getVuexProxy } from '~/plugins/vuex'

export class BaseApi {
  protected _axios: AxiosInstance;
  protected _vuex!: ReturnType<typeof getVuexProxy>;

  constructor (config: Partial<AxiosRequestConfig> = {}, base: string = '/', mock?: (a: AxiosInstance) => void) {
    const BaseUrlObj = new URL('', config.baseURL ?? location?.origin ?? '/')
    const origin = BaseUrlObj.origin
    const path = BaseUrlObj.pathname

    const baseURL = (new URL(`${path}/${base}`.replace(/\/+/g, '/'), origin)).href

    this._axios = Axios.create({
      ...config,
      baseURL,
      adapter: axiosCache.adapter
    })
    this._axios.interceptors.response.use((value) => {
      if (value.data instanceof Object && 'error' in value.data) {
        return Promise.reject(value)
      }
      return value
    })
    if (mock) {
      mock(this._axios)
    }
  }

  setAxiosConfig (config: Partial<AxiosRequestConfig>) {
    this._axios.defaults = Object.assign({}, this._axios.defaults, config)
  }

  setVuexProxy (vuex: ReturnType<typeof getVuexProxy>) {
    this._vuex = vuex
  }
}
