import { DEALS_SORT_TYPES } from '~/types/deals'
// import { ICity, IFlat, IHouse, IStreet } from '~/types/location'

export enum TARIFF_PACKET_TYPE {
  UNDEFINED,
  ALL,
  INTERNET,
  INTERNET_TV,
  INTERNET_TV_CELLULAR,
  TV,
  INTERNET_CELLULAR,
  CCTV
}

export interface FilterOptionVariant {
  name: string;
  id: string|number;
}

export type FilterEnableCase = [
  'is'|'not',
  number|string
] | [
  'in',
  (number|string)[]
]

interface FilterBase {
  name: string;
  id: string;
  sort: number;
  options?: Record<string, any>;
  hint?: string;
  enabled?: {
    [key: string]: FilterEnableCase
  }
}

export interface CheckboxFilterOption extends FilterBase {
  type: 'checkbox';
  value: (string|number)[];
  variants: FilterOptionVariant[];
}

export interface RadioFilterOption extends FilterBase {
  type: 'radio';
  value?: string|number;
  variants: FilterOptionVariant[];
  boolean?: boolean;
}

export interface SelectFilterOption extends FilterBase {
  type: 'select';
  value?: string|number;
  variants: FilterOptionVariant[];
}

export interface CheckboxImageFilterOption extends FilterBase {
  type: 'checkbox_image';
  value: (string|number)[];
  variants: (FilterOptionVariant & { image: string })[];
}

export interface RangeFilterOption extends FilterBase {
  type: 'range';
  value?: [number, number];
  min: number;
  max: number;
  unit: string;
  measure: string;
}

export interface TextFilterOption extends FilterBase {
  type: 'text';
  label: string;
  value?: string;

}

export interface NumberFilterOption extends FilterBase {
  type: 'number';
  label?: string;
  value?: number;
  min: number;
  max: number;
  step?: number;
}

export type FilterOption = CheckboxFilterOption
  |RadioFilterOption
  |CheckboxImageFilterOption
  |RangeFilterOption
  |TextFilterOption
  |NumberFilterOption
  |SelectFilterOption

export type FilterLocationData = {city_fias_id: string, house_id?: string}// ICity & IStreet & IHouse & IFlat

export type FilterOptionsData = Record<string, string|number|(string|number)[]>
export interface FilterRequestDTO {
  city_fias_id: FilterLocationData['city_fias_id'];
  house_id?: FilterLocationData['house_id']
  filter_include: Partial<FilterOptionsData>;
  filter_exclude: Partial<FilterOptionsData>;
  offset: number;
  limit: number;
  sort: DEALS_SORT_TYPES[];
}
