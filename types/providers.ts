import { IArticle, IImage } from '~/types/blog'
export interface IProvider {
  MainColor: string;
  Name: string;
  PhoneNumber: null;
  PrimaryColor: null;
  SecondaryColor: null;
  Slider: ISlider[];
  SourceID: number;
  StartInternetPrice: null;
  StartTVPrice: null;
  Tarifs: string;
  created_at: string;
  id: number;
  ProviderLogo: IStrapiImg;
  mainSlider: null;
  phoneNumber: string;
  raiting: number;
  services: string;
  slug: string;
  sourceID: null;
  title: null;
  updated_at: string;
  devices: IDevice[];
  connection: string;
  payment: string;
  posts: IArticle[],
  BestOffersLogo: IStrapiImg,
  aboutBenefits: IBenefits[],
  About: string,
  OfferList: {Title: string, Description: string, id: number}[],
  ProviderDealerLogo: IStrapiImg,
  FilterAndTariffHeaderLogo: IStrapiImg
}

interface ISlider {
  Title: string;
  Description: string;
  id: number;
  Images: IStrapiImg;
}

interface IBenefits {
  id: number,
  title: string,
  description: string,
  image: IImage
}

export interface IDevice {
  Provider: string;
  SecondField: null;
  SourceID: number;
  SourseID: null;
  ThirdField: null;
  Title: string;
  created_at: string;
  description: string;
  characteristics: string;
  created_by: number;
  id: number;
  provider: number;
  updated_at: string;
  updated_by: number;
  image: IStrapiImg[],
  price: string
}
interface IStrapiImg {
  alternativeText: string;
  caption: string;
  created_at: string;
  ext: string;
  formats: null;
  hash: string;
  height: number;
  id: number;
  mime: string;
  name: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  size: number;
  updated_at: string;
  url: string;
  width: number;
}
