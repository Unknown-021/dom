/* eslint-disable require-await */
import { action, createModule, mutation } from 'vuex-class-component'
import { BreadcrumbItem } from '~/types/layout'
import { ICity, IHouse, IStreet } from '~/types/location'

export class BreadcrumbsStore extends createModule({
  target: 'nuxt',
  namespaced: 'breadcrumbs'
}) {
  public breadcrumbs: BreadcrumbItem[] = []

  @mutation SetBreadcrumbs (payload: BreadcrumbItem[]) {
    this.breadcrumbs = [...payload]
  }

  @action async SetMainCrumbs () {
    this.SetBreadcrumbs([
      await this.GetMainPageCrumb()
    ])
  }

  @action async SetBlogCrumbs (articleName?: string) {
    const crumbs: BreadcrumbItem[] = [
      await this.GetMainPageCrumb(),
      await this.GetBlogPageCrumb()
    ]

    if (articleName) {
      crumbs.push(await this.GetBlogPageCrumb(articleName))
    }

    this.SetBreadcrumbs(crumbs)
  }

  @action async SetProvidersCrumbs (providerName?: string) {
    const crumbs: BreadcrumbItem[] = [
      await this.GetMainPageCrumb(),
      await this.GetProvidersPageCrumb()
    ]

    if (providerName) {
      crumbs.push(await this.GetProvidersPageCrumb(providerName))
    }

    this.SetBreadcrumbs(crumbs)
  }

  @action async SetTariffCrumbs (tariff?: BreadcrumbItem) {
    const crumbs: BreadcrumbItem[] = [
      await this.GetMainPageCrumb(),
      await this.GetDealsPageCrumb()
    ]

    if (tariff) {
      crumbs.push(tariff)
    }

    this.SetBreadcrumbs(crumbs)
  }

  @action async SetStreetCrumbs () {
    const crumbs: BreadcrumbItem[] = [
      await this.GetMainPageCrumb(),
      ...await this.GetStreetPageCrumb()
    ]

    this.SetBreadcrumbs(crumbs)
  }

  @action private async GetMainPageCrumb (): Promise<BreadcrumbItem> {
    return {
      name: 'Главная',
      loc: { name: 'index' }
    }
  }

  @action private async GetBlogPageCrumb (articleName?: string): Promise<BreadcrumbItem> {
    return articleName ? {
      name: articleName || 'Блог'
    } : {
      name: 'Блог',
      loc: { name: 'blog' }
    }
  }

  @action private async GetProvidersPageCrumb (articleName?: string): Promise<BreadcrumbItem> {
    return articleName ? {
      name: articleName || 'Провайдеры'
    } : {
      name: 'Провайдеры'
    }
  }

  @action private async GetDealsPageCrumb (): Promise<BreadcrumbItem> {
    const location: IStreet & ICity & IHouse = this.$store.rootGetters['location/fullLocationState']
    if (!location.houseNumber || !location.streetSlug) {
      return {
        name: 'Тарифы',
        loc: { name: 'tariffs', params: { city: location.citySlug } }
      }
    }
    return {
      name: 'Тарифы',
      loc: {
        name: 'deals',
        params: {
          city: location.citySlug,
          street: location.streetSlug,
          house: location.houseNumber
        }
      }
    }
  }

  @action private async GetStreetPageCrumb (): Promise<BreadcrumbItem[]> {
    return [
      {
        name: this.$store.rootState.location.userCity.cityName || 'Город',
        loc: {
          name: 'index', params: { city: this.$store.rootState.location.userCity.citySlug }
        }
      },
      {
        name: this.$store.rootState.location.userStreet.streetName || 'Улица'
      }
    ]
  }
}
