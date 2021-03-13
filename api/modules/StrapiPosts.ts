import { BaseApi } from '~/api/BaseApi'
import { DomApiPromise } from '~/types/api'
import { IArticle } from '~/types/blog'
import { IProvider } from '~/types/providers'

export class StrapiPosts extends BaseApi {
  protected _vuex!: any;

  async GetAll () {
    const response = await this._axios.get('/')
    const results = await { results: response.data, exists_more: false, count: response.data.length }
    return results
  }

  GetById (ids: string[]): Promise<IArticle[]>;
  GetById (ids: string): Promise<IArticle>;
  async GetById (ids: string[] | string) {
    if (Array.isArray(ids)) {
      return this._axios.get('/', {
        params: {
          slug_in: ids
        }
      })
    }

    const { data } = await this._axios.get('/', {
      params: {
        slug: ids
      }
    })
    const [item] = data
    if (!item) {
      throw new Error('No item found')
    }
    return item
  }

  async GetNewPosts (offset = 0, limit = 6): DomApiPromise<IArticle> {
    const response = await this._axios.get('/', {
      params: { _limit: limit, _start: offset, _sort: 'published_at:desc' }
    })
    const count: number = (await this._axios.get('/count')).data
    if (!response.data) {
      throw new Error('Error fetch posts')
    }
    const sortArr = (response.data as IArticle[]).sort((a, b) => {
      return Number(a.Published_at < b.Published_at)
    })

    return {
      count,
      results: sortArr,
      exists_more: count > (offset + limit)
    }
  }

  async GetBlogInit (): Promise<Record<string, { count: number, results: IArticle[] }>> {
    const { data } = await this._axios.get('/blog')

    return data
  }

  async ByCategories (cat: string, offset: number = 0, limit: number = 4): DomApiPromise<IArticle> {
    const response = await this._axios.get('/?_sort=published_at:desc&category=' + cat, {
      params: { _limit: limit, _start: offset }
    })

    const count = (await this._axios.get('/count/?category=' + cat)).data
    if (!response.data) {
      throw new Error('Error fetch posts')
    }
    const sortArr = (response.data as IArticle[]).sort((a, b) => {
      return Number(a.Published_at < b.Published_at)
    })
    return {
      count,
      results: sortArr,
      exists_more: count > (offset + limit)
    }
  }

  async PopularPosts (offset = 0, limit = 4): DomApiPromise<IArticle> {
    const response = await this._axios.get('/?_sort=published_at:desc&popular=true', {
      params: { _limit: limit, _start: offset }
    })
    const count: number = (await this._axios.get('/count/?popular=true')).data
    if (!response.data) {
      throw new Error('Error fetch posts')
    }
    const sortArr = (response.data as IArticle[]).sort((a, b) => {
      return Number(a.Published_at < b.Published_at)
    })

    return {
      count,
      results: sortArr,
      exists_more: count > (offset + limit)
    }
  }

  async ParntersPosts (offset = 0, limit = 4): DomApiPromise<IArticle> {
    const response = await this._axios.get('?_sort=published_at:desc&provider_null=false', {
      params: { _limit: limit, _start: offset }
    })
    const count: number = (await this._axios.get('/count/?provider_null=false')).data
    if (!response.data) {
      throw new Error('Error fetch posts')
    }
    const sortArr = (response.data as IArticle[]).sort((a, b) => {
      return Number(a.Published_at < b.Published_at)
    })

    return {
      count,
      results: sortArr,
      exists_more: count > (offset + limit)
    }
  }

  async GetLastPosts (limit: number = 3): Promise <IArticle[]> {
    const { data } = await this._axios.get('/', {
      params: { _limit: limit }
    })
    return data
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
