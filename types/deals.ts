import { ICmsBlogPage, IImage } from '~/types/blog'
import { ITariffPageComponent } from '~/types/layout'
import { IProvider } from '~/types/providers'
export enum DEALS_SORT_TYPES {
  UNDEFINED,
  // POPULARITY,
  SPEED_FAST = '-service__speed',
  COST_CHEAP = 'price',
}
export enum DEAL_SERVICE_TYPE {
  UNDEFINED,
  INTERNET,
  TV,
  MOBILE = 4,
  CCTV = 5
}
export interface DealBenefitItem {
  text: string;
  rate: number;
  group_key: null;
  group_name: string;
}
export interface ServiceTypeBase {
  packages_use_default_index?: number;
  service_type: DEAL_SERVICE_TYPE;
}
export interface ServiceInternet extends ServiceTypeBase {
  speed: number;
  speed_old: number | null;
  units: string;
  service_type: DEAL_SERVICE_TYPE.INTERNET;
}
export interface ServiceTv extends ServiceTypeBase {
  channels_count: number;
  packages_use: DealTvPackage[];
  service_type: DEAL_SERVICE_TYPE.TV;
}
export interface ServiceCCTV extends ServiceTypeBase {
  service_type: DEAL_SERVICE_TYPE.CCTV;
}
export interface DealTvPackage {
  channels_count: number;
  hd_channels_count: number;
  included: boolean;
  package: number;
  surcharge: number | null;
  cost?: number; // TOBACKEND
}
export interface ServiceMobile extends ServiceTypeBase {
  sim_count: number;
  minutes: number;
  gigabytes: number;
  sms: number;
  service_type: DEAL_SERVICE_TYPE.MOBILE;
}
export type DealServiceItem = ServiceInternet
  | ServiceTv
  | ServiceCCTV
  | ServiceMobile;
export type DealAttributeKeyType = 'promo'
  | 'first_month_cost'
  | 'after_promo_cost'
  | 'credit_payment'
  | 'prepaid_payment'
  | 'install_payment'
  | 'contract'
  | 'promo_period';
export interface DealAttribute {
  key: DealAttributeKeyType;
  name: string;
  description: string;
  rate: number;
  group_key: string|null;
  group_name: string;
  internal: boolean;
  value?: string;
  units?: string;
  value2?: string;
  units2?: string;
}
export interface DealDevice {
  device: number;
  method: number;
  cost: number | null;
  cost_norm: number | null;
  monthly_payment: number | null;
  single_payment: number | null;
  installment_period: number | null;
  description: string;
  display: string;
  techs: string[];
  services: DEAL_SERVICE_TYPE[];
}
export interface IDealItem {
  id: number;
  tariff_set?: number;
  technology: string[];
  provider: IProvider['id']|null;
  price: number;
  price_norm: number | null;
  name: string;
  content: string;
  attributes: DealAttribute[];
  benefits: DealBenefitItem[];
  services: DealServiceItem[];
  device_offer?: Array<{
    description: string;
    device_terms: DealDevice[];
  }>;
  device_use: DealDevice[];
  device_use_default_idx?: number;
}
export interface IPages<T = IPageComponent> {
  id: number,
  Path: string,
  created_at: string,
  updated_at: string,
  PageComponent: T[],
  SeoComponent: [];
}
export type IPageComponent = IMainPageComponent|
ICmsBlogPage|ITariffPageComponent
export interface IMainPageComponent {
  __component: string,
  id: number,
  MainNumber: string,
  FirstBlockTitle: string,
  FirstBlockDescription: string,
  SecondTitleBlock: string,
  SecondBlockDescription: string,
  ThirdBlockTitle: string,
  ThirdBlockDescription: string,
  FourthBlockTitle: string,
  FourthBlockDescription: string,
  FirstConnectionStep: string,
  SecondConnectionStep: string,
  ThirdConnectionStep: string,
  FourthConnectionStep: string,
  FifthConnectionStep: string,
  FifthBlockTitle: null,
  FifthBlockDescription: null,
  PopularQuestion: Array<{
    id: number,
    Title: string,
    Description: string;
  }>,
}

export interface IComponentMain
  {
    id: 3,
    Path: string,
    created_at: string,
    updated_at: string,
    PageComponent: [IMainPageComponent],
    SeoComponent: [ IStaticSEO, IDynamicSEO]
  }
export interface IStaticSEO {
    __component: 'seo-component.seo-component',
    id: number,
    title: string,
    description: string,
    keywords: string,
    ogTitle: string,
    ogImage: IImage
  }
export interface IDynamicSEO {
    __component: 'seo-component.seo-dynamic',
    id: 3,
    Description: string,
    Keywords: string,
    DynamicTitleGroup1: string,
    DynamicTitleGroup2: string,
    DynamicTitleGroup3: string,
    DynamicDescriptionGroup1: string,
    DynamicDescriptionGroup2: string,
    DynamicDescriptionGroup3: string,
    DynamicKeywords: string,
    ogTitle: string,
    ogImage: IImage
  }
