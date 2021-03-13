import dayjs from 'dayjs'
import { action, createModule, mutation } from 'vuex-class-component'
import { IComponentMain, IDealItem, IMainPageComponent, IPages } from '~/types/deals'
import { IStreetPageComponent, IHousesListPageComponent, ITariffBlockPage, IBlogDetailPageComponent, IDealsPageComponent, IStreetComponent, ISpeedTestComponent, IComparePage, ItariffDetailPage, IproviderDetailPage } from '~/types/layout'
import Api from '~/api'
import { IBlogPageComponent, ICmsBlogPage } from '~/types/blog'
import { IProvider } from '~/types/providers'
export class LayoutStore extends createModule({
  target: 'nuxt',
  namespaced: 'layout'
}) {
  private _mobileDealModalItem: IDealItem|undefined = undefined;
  private _cityChooser = false
  public pages: IPages[] = [] as IPages[]
  public mainPage: IMainPageComponent|null = null
  public mainPageSeo: IComponentMain['SeoComponent']|null = null
  public blogPage: IBlogPageComponent|null = null
  public blogPageSeo: ICmsBlogPage['SeoComponent']|null = null
  public blogDetailPage: IBlogDetailPageComponent['PageComponent']|null = null
  public blogDetailPageSeo: IBlogDetailPageComponent['SeoComponent']|null = null
  public streetPage: IStreetPageComponent|null = null
  public streetPageSeo: IStreetComponent['SeoComponent']|null = null
  public speedTestPage: ISpeedTestComponent['PageComponent']|null = null
  public speedTestPageSeo: ISpeedTestComponent['SeoComponent']|null = null
  public comparePage: IComparePage['PageComponent']|null = null
  public comparePageSeo: IComparePage['SeoComponent']|null = null
  public tariffPage: ITariffBlockPage|null = null
  public tariffPageSeo: ItariffDetailPage['SeoComponent']|null = null
  public dealsPage: IDealsPageComponent['PageComponent']|null = null
  public dealsPageSeo: IDealsPageComponent['SeoComponent']|null = null
  public providerDetailPage: IProvider|null = null
  public providerDetailPageSeo: IproviderDetailPage['SeoComponent']|null = null
  private _callBack = false
  private _adressCheckModal = false
  private _bugReport = false
  public housesList: IHousesListPageComponent|null = null

  @action async GetMainPage () {
    const page = await Api.pages.getMainPage()
    this.mainPage = page.PageComponent[0]
    this.mainPageSeo = page.SeoComponent
  }

  @action async GetBlogPage () {
    const page = await Api.pages.getBlogPage()
    this.blogPage = page.PageComponent[0]
    this.blogPageSeo = page.SeoComponent
  }

  @action async GetTariffPage () {
    const page = await Api.pages.getTariffPage()
    this.tariffPage = page.PageComponent[0] // TODO: НЕ ЗАБЫТЬ РАСКОММЕНТИТЬ КОГДА ПОЯВИТСЯ СТРАНИЦА [0]
    this.tariffPageSeo = page.SeoComponent
  }

  @action async GetDealsPage () {
    const page = await Api.pages.getDealsPage()
    this.dealsPage = null/* page.PageComponent[0] */
    this.dealsPageSeo = page.SeoComponent
  }

  @action async GetStreetPage () {
    const page = await Api.pages.getStreetPage()
    this.streetPage = page.PageComponent[0]
    this.streetPageSeo = page.SeoComponent
  }

  @action async GetSpeedTestPage () {
    const page = await Api.pages.getSpeedTestPage()
    this.speedTestPage = page.PageComponent // TODO: НЕ ЗАБЫТЬ РАСКОММЕНТИТЬ КОГДА ПОЯВИТСЯ СТРАНИЦА [0]
    this.speedTestPageSeo = page.SeoComponent
  }

  @action async GetComparePage () {
    const page = await Api.pages.getComparePage()
    this.comparePage = page.PageComponent // TODO: НЕ ЗАБЫТЬ РАСКОММЕНТИТЬ КОГДА ПОЯВИТСЯ СТРАНИЦА [0]
    this.comparePageSeo = page.SeoComponent
  }

  @action async GetProviderDetailPage () {
    const page = await Api.pages.getProviderDetailPage()
    this.providerDetailPage = page.PageComponent[0]
    this.providerDetailPageSeo = page.SeoComponent
  }

   @action async GetBlogDetailPage () {
    const page = await Api.pages.getBlogDetailPage()
    this.blogDetailPage = page.PageComponent[0]
    this.blogDetailPageSeo = page.SeoComponent
  }

  @action async GetStreetPageHouses ({ city, street }: {city: string, street: string}) {
     const list = await Api.fromsHelpers.GetStreetPageHousesList(city, street)
     this.SET_HOUSES_LIST(list || [])
   }

  @mutation SET_HOUSES_LIST (items: IHousesListPageComponent) {
    this.housesList = { ...items }
  }

  get bugReport () {
    return this._bugReport
  }

  set bugReport (val) {
    this._bugReport = val
  }

  get callBack () {
    return this._callBack
  }

  get adressCheckModal () {
    return this._adressCheckModal
  }

  set callBack (val) {
    this._callBack = val
  }

  set adressCheckModal (val) {
    this._adressCheckModal = val
  }

  get cityChooser () {
    return this._cityChooser
  }

  set cityChooser (val) {
    this._cityChooser = val
  }

  get mobileDeal () {
    return this._mobileDealModalItem
  }

  set mobileDeal (val) {
    this._mobileDealModalItem = val
  }

  get comingDates (): Array<{
    text: string;
    value: string;
  }> {
    const allowedTime = new Date().getHours() < 24
    const today = allowedTime ? '' : 'Сегодня'
    // Generate comming 7 days
    return Array(7).fill('').map((_, i) => {
      const value = dayjs().add(i, 'd').format('DD.MM.YYYY')
      const text = (() => {
        switch (i) {
          case 0: return 'Сегодня'
          case 1: return 'Завтра'
          case 2: return 'Послезавтра'
          default: return value
        }
      })()
      return { text, value }
    }).filter(el => el?.text !== today)
  }
}
export function getStreetHousesList () {
  return {
    '1-10': [
      {
        homeNumber: '1я',
        id: 1
      },
      {
        homeNumber: '2',
        id: 2
      },
      {
        homeNumber: '10',
        id: 10
      }
    ],
    '11-20': [
      {
        homeNumber: '11я',
        id: 11
      },
      {
        homeNumber: '12',
        id: 12
      },
      {
        homeNumber: '20',
        id: 20
      }
    ],
    '21-30': [
      {
        homeNumber: '21я',
        id: 21
      },
      {
        homeNumber: '22',
        id: 22
      },
      {
        homeNumber: '23',
        id: 23
      },
      {
        homeNumber: '24я',
        id: 24
      },
      {
        homeNumber: '25',
        id: 25
      },
      {
        homeNumber: '26',
        id: 26
      },
      {
        homeNumber: '27я',
        id: 27
      },
      {
        homeNumber: '28',
        id: 28
      },
      {
        homeNumber: '29',
        id: 29
      },
      {
        homeNumber: '30я',
        id: 30
      },
      {
        homeNumber: '31',
        id: 31
      },
      {
        homeNumber: '32',
        id: 32
      },
      {
        homeNumber: '33я',
        id: 33
      },
      {
        homeNumber: '34/320',
        id: 34
      },
      {
        homeNumber: '35',
        id: 35
      }
    ]
  }
}
