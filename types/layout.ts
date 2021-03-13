import { Location } from 'vue-router'
import { IDynamicSEO, IStaticSEO } from '~/types/deals'
import { IProvider } from '~/types/providers'
export interface BreadcrumbItem {
  name: string;
  loc?: Location;
}
export interface ITariffPageComponent {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [ITariffBlockPage],
  SeoComponent: (IStaticSEO|IDynamicSEO)[]
}

export interface IDealsPageComponent {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [],
  SeoComponent: (IStaticSEO|IDynamicSEO)[]
}

export interface IBlogDetailPageComponent {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}

export interface IStreetComponent {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [IStreetPageComponent],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}

export interface ISpeedTestComponent {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}

export interface IComparePage {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}

export interface ItariffDetailPage {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [ITariffBlockPage],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}

export interface IproviderDetailPage {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: [IProvider],
  SeoComponent: (IStaticSEO|IDynamicSEO)[ ]
}
export interface ITariffBlockPage {
  id: number,
  FildsWithImage: {
    id: number,
    Title: string,
    Items: {
        id: number,
        Title: string,
        Description: string
      }[]
  }
}
export interface IStreetPageComponent {
  FirstBlock: {
    id: number;
    Title: string;
    Description: string;
  };
  FieldWithImage: {
    id: number;
    Title: string;
    ArticleWithImage: Array<{
      id: number;
      Title: string;
      Description: string;
    }>
  }
}
export interface HouseListItem {
    'number': string,
    'fias_id': string,
    'slug': string,
    'house_id': string
}
export type IHousesListPageComponent = Record<string, HouseListItem[]>
