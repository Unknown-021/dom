import { IDynamicSEO, IStaticSEO } from '~/types/deals'
import { ITariffBlockPage } from '~/types/layout'
import { IProvider } from '~/types/providers'

export interface BlogPreviewItem {
  Title: string;
  description: string;
  Image: string;
  timeToRead?: number;
  slug: string;
}

export interface BlogCategory {
  id: string;
  name: string;
}

export interface IArticle {
  id: number,
  Title: string,
  created_at: string,
  updated_at: string,
  SourseID: null,
  SourceID: string,
  richText: null,
  published_at: string,
  Post: string,
  Deals: null,
  SEO_Title: null,
  SEO_Description: null,
  SEO_Keywords: null,
  slug: string,
  Slider: [],
  Image: IImage,
  previewImg: IImage,
  Published_at: string,
  tarrifs: ITariffForSliderID[],
  category: 'trouble',
  popular: boolean,
  provider: IProvider,
  shortText: string,
  timeToRead: string;
}
export interface ICmsBlogPage {
  id: 3,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [IBlogPageComponent],
  SeoComponent: (IStaticSEO|IDynamicSEO)[]
}
export interface ICmsDealsPage {
  id: 3,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [ITariffBlockPage],
  SeoComponent: (IStaticSEO|IDynamicSEO)[]
}

export interface IBlogPageComponent {
  SubscribeSection: string;
  SubscribeSectionTitle: string,
  id: number;
}

export interface IImage {
  id: string,
  name: string,
  alternativeText: '',
  caption: string,
  hash: string,
  ext: string,
  mime: string,
  url: string,
  previewUrl: null,
  provider: string,
  provider_metadata: null,
  created_at: string,
  updated_at: string;
}

interface ITariffForSliderID {
  SourceID: string,
  Name: string;
}
