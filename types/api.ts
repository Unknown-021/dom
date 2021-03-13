import { IProvider } from '~/types/providers'

export interface DictionaryApiModule<T, K extends keyof T, F extends keyof T = K> {
  GetAll(): DomApiPromise<T>;
  GetById(id: T[K][]): Promise<T[]>;
  GetById(id: T[K]): Promise<T>;
  GetFilters (filters: Partial<Pick<T, F>>): DomApiPromise<T>
}

export interface DomApiResponseBase<T> {
  count: number;
  exists_more: boolean;
  results: T[];
}

export type DomApiPromise<T> = Promise<DomApiResponseBase<T>>

export interface LocationProviderFilters {
  providers: IProvider['id'][];
  max_price: number;
  min_price: number;
  max_speed: number;
  min__speed: number;
}

export interface LocationProvidersResponse<T> {
  count: number;
  providers_count: number;
  exists_more: boolean;
  results: T[];
  filters_data: LocationProviderFilters;
}

export type LocationProvidersPromise<T> = Promise<LocationProvidersResponse<T>>
