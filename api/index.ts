import { AxiosRequestConfig } from 'axios'
import { CallBackApi } from './modules/callBack'
import { FromsHelpers } from './modules/formsHelper'
import { BugReportApi } from './modules/bugReport'
import { DealsApi } from '~/api/modules/deals'
import { DevicePaymentMethodsApi } from '~/api/modules/devicePaymentMethods'
import { DeviceApi } from '~/api/modules/device'
import { BackDeviceApi } from '~/api/modules/backDevice'
import { DeviceTypesApi } from '~/api/modules/deviceTypes'
import { FiltersApi } from '~/api/modules/filters'
import { ServiceTypesApi } from '~/api/modules/serviceTypes'
import { TariffApi } from '~/api/modules/tariff'
import { TvChannelsApi } from '~/api/modules/tvChannels'
import { TvPackageApi } from '~/api/modules/tvPackages'
import { ProvidersApi } from '~/api/modules/providers'
import { getVuexProxy } from '~/plugins/vuex'
import { CityApi } from '~/api/modules/city'
import { RegionApi } from '~/api/modules/region'
import { GeoLocationApi } from '~/api/modules/location'
import { StrapiProviders } from '~/api/modules/StrapiProviders'
import { StrapiPosts } from '~/api/modules/StrapiPosts'
import { PagesApi } from '~/api/modules/pages'

class ApiInstance {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    config: Partial<AxiosRequestConfig> = {
      baseURL: process.env.NUXT_ENV_BACKEND_API_ROOT_URL,
      timeout: process.client ? 30000 : 10000
    },
    cmsConfig: Partial<AxiosRequestConfig> = {
      baseURL: `${process.env.NUXT_ENV_CMS_URL}`
    },
    public filters = new FiltersApi(config),
    public cities = new CityApi(config, '/cities/'),
    public regions = new RegionApi(config, '/regions/'),
    public deals = new DealsApi(config, '/'),
    public serviceTypes = new ServiceTypesApi(config, '/service-types/'),
    public device = new DeviceApi(cmsConfig, '/devices/'),
    public deviceBack = new BackDeviceApi(config, '/devices/'),
    public devicePaymentMethods = new DevicePaymentMethodsApi(config, '/devices/payment-methods/'),
    public deviceTypes = new DeviceTypesApi(config, '/devices/types/'),
    public geoLocation = new GeoLocationApi(config, '/'),
    public tariff = new TariffApi(config, '/tariffs/'),
    public tvChannels = new TvChannelsApi(config, '/tv-channels/'),
    public tvPackage = new TvPackageApi(config, '/tv-packages/'),
    public providers = new ProvidersApi(config, '/providers/'),
    public strapiProvidersApi = new StrapiProviders(cmsConfig, '/providers/'),
    public strapiPostsApi = new StrapiPosts(cmsConfig, '/posts/'),
    public callback = new CallBackApi(config, '/'),
    public fromsHelpers = new FromsHelpers(config, '/'),
    public bugReport = new BugReportApi(config, '/'),
    public pages = new PagesApi(cmsConfig, '/pages/')
  ) {

  }

  setVuex (vuex: ReturnType<typeof getVuexProxy>) {
    this.filters.setVuexProxy(vuex)
    this.deals.setVuexProxy(vuex)
    this.serviceTypes.setVuexProxy(vuex)
    this.device.setVuexProxy(vuex)
    this.deviceBack.setVuexProxy(vuex)
    this.devicePaymentMethods.setVuexProxy(vuex)
    this.deviceTypes.setVuexProxy(vuex)
    this.tariff.setVuexProxy(vuex)
    this.tvChannels.setVuexProxy(vuex)
    this.tvPackage.setVuexProxy(vuex)
    this.providers.setVuexProxy(vuex)
    this.geoLocation.setVuexProxy(vuex)
    this.strapiProvidersApi.setVuexProxy(vuex)
    this.strapiPostsApi.setVuexProxy(vuex)
  }
}

const mainInstance = new ApiInstance()

export default mainInstance
