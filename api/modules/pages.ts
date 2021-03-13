import { BaseApi } from '~/api/BaseApi'
import { ICmsBlogPage } from '~/types/blog'
import { IComponentMain } from '~/types/deals'
import { IComparePage, IDealsPageComponent, IproviderDetailPage, ISpeedTestComponent, IStreetComponent, ItariffDetailPage } from '~/types/layout'
export class PagesApi extends BaseApi {
  async getMainPage (): Promise<IComponentMain> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Main'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No main page component')
    }
    return component
  }

  async getBlogPage (): Promise<ICmsBlogPage> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Blog'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No blog page component')
    }
    return component
  }

  async getStreetPage (): Promise<IStreetComponent> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Street'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No street page component')
    }
    return component
  }

  async getDealsPage (): Promise<IDealsPageComponent> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Deals'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No deals page component')
    }
    return component
  }

  async getTariffPage (): Promise<ItariffDetailPage> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Tariff detail'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No tariff page component')
    }
    return component
  }

  async getSpeedTestPage (): Promise<ISpeedTestComponent> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Speed test'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No Speed test page component')
    }
    return component
  }

  async getComparePage (): Promise<IComparePage> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Compare'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No compare page component')
    }
    return component
  }

  async getProviderDetailPage (): Promise<IproviderDetailPage> {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Provider detail'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No ProviderDetail page component')
    }
    return component
  }

  async getBlogDetailPage ()/* : Promise<ITariffPageComponent> */ {
    const { data } = await this._axios.get('/', {
      params: {
        Name: 'Blog detail'
      }
    })
    const component = data[0]
    if (!component) {
      throw new Error('No BlogDetail page component')
    }
    return component
  }
}
