import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'
import { BlogPreviewItem, BlogCategory, IArticle } from '~/types/blog'
import api from '~/api'

export class BlogStore extends createModule({
  target: 'nuxt',
  namespaced: 'blog'

}) {
  newPosts: IArticle[] = [];
  newPostsExists: boolean = false;
  lastPosts: IArticle[] = [];

  blogCategories: BlogCategory[] = [
    {
      name: 'Решение проблем',
      id: 'trouble'
    },
    {
      name: 'Выбор интернета',
      id: 'internet'
    },
    {
      name: 'Услуги провайдеров',
      id: 'providerServices'
    },
    {
      name: 'Обзоры оборудования',
      id: 'reviews'
    },
    {
      name: 'Wi-Fi',
      id: 'wifi'
    }
  ];

  blogPreviewsByCategories: Record<string, { results: IArticle[], more: boolean; }> = {
    trouble: { results: [], more: false },
    internet: { results: [], more: false },
    providerServices: { results: [], more: false },
    reviews: { results: [], more: false },
    wifi: { results: [], more: false },
    useful: { results: [], more: false }
  };

  blogPopularPreviews: IArticle[] = [];
  blogPopularPreviewsExist: boolean = false;

  blogNewArticles: BlogPreviewItem[] = [];

  blogPartnersNews: IArticle[] = [];
  blogPartnersNewsExist: boolean = false;

  // Инициализирующий страницу action
  @action async BlogInit () {
    // запрос на cms
    const posts = await api.strapiPostsApi.GetBlogInit()
    // получаем популярные посты
    this.SetPopularArticles({
      blogPopular: posts.popular?.results || [],
      morePopular: posts.popular?.count > posts.popular?.results?.length || false,
      init: true
    })
    // получаем посты по категориям
    Object.keys(this.blogPreviewsByCategories).forEach((key) => {
      if (key in posts) {
        this.AddCategoryArticles({
          key,
          items: posts[key].results,
          more: posts[key]?.count > posts[key]?.results?.length || false,
          init: true
        })
      }
    })
    // получаем новые посты
    this.SetNewPosts({
      posts: posts.newsPosts?.results || [],
      more: posts.newsPosts?.count > posts.newsPosts?.results?.length || false,
      init: true
    })
    // получаем посты с провайдерами
    this.SetPartnersArticles({
      blogPartners: posts.provider?.results || [],
      more: posts.provider?.count > posts.provider?.results?.length || false,
      init: true
    })
  }

  @action async GetBlogPartnersNews (limit: number = 3) {
    if (limit === 0) {
      return
    }
    const response = await api.strapiPostsApi.ParntersPosts(this.blogPartnersNews.length, limit)
    const blogPartners = response.results
    const more = response.exists_more
    this.SetPartnersArticles({ blogPartners, more, init: false })
  }

  @action async GetArticleById (_id: string): Promise<IArticle> {
    const response = await api.strapiPostsApi.GetById(_id)
    return await Promise.resolve(response)
  }

  @action async GetBlogCategoryMore (key: string) {
    const response = await api.strapiPostsApi.ByCategories(key, this.blogPreviewsByCategories[key] ? this.blogPreviewsByCategories[key].results.length : 0)
    const more: boolean = response.exists_more
    this.AddCategoryArticles({ key, items: response.results, more, init: false })
  }

  @action async GetPopularPosts () {
    const response = await api.strapiPostsApi.PopularPosts(this.blogPopularPreviews.length)
    const blogPopular = response.results
    const morePopular = response.exists_more
    this.SetPopularArticles({ blogPopular, morePopular, init: false })
  }

  @action async NewPosts (offset = 0) {
    const response = await api.strapiPostsApi.GetNewPosts(offset)
    this.SetNewPosts({ posts: response.results, more: response.exists_more, init: false })
  }

  @action async LastPosts () {
    const response = await api.strapiPostsApi.GetLastPosts()
    this.lastPosts = [...response]
  }

  @mutation SetNewPosts (payload: { posts: IArticle[], more: boolean, init: boolean; }) {
    if (payload.init && this.newPosts.length) {
      return
    }
    this.newPosts = payload.posts
    this.newPostsExists = payload.more
  }

  @mutation AddCategoryArticles ({ key, items, more, init }: { key: string, items: IArticle[], more: boolean, init: boolean; }) {
    if (init && this.blogPreviewsByCategories[key].results.length) {
      return
    }
    this.blogPreviewsByCategories[key].results = [...this.blogPreviewsByCategories[key].results, ...items]
    this.blogPreviewsByCategories[key].more = more
  }

  @mutation SetPopularArticles (payload: { blogPopular: IArticle[], morePopular: boolean, init: boolean; }) {
    if (payload.init && this.blogPopularPreviews.length) {
      return
    }
    this.blogPopularPreviewsExist = payload.morePopular
    payload.blogPopular.forEach((el) => { this.blogPopularPreviews.push(el) })
  }

  @mutation SetPartnersArticles (payload: { blogPartners: IArticle[], more: boolean, init: boolean; }) {
    if (payload.init && this.blogPartnersNews.length) {
      return
    }
    this.blogPartnersNewsExist = payload.more
    payload.blogPartners.forEach((el) => { this.blogPartnersNews.push(el) })
  }

  @mutation SetCategoryArticles ({ category, payload }: { category: string; payload: IArticle[]; }) {
    if (category in this.blogPreviewsByCategories) {
      this.blogPreviewsByCategories[category].results = [...payload]
    } else {
      Vue.set(this.blogPreviewsByCategories, category, payload)
    }
  }
}
