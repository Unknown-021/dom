/* eslint-disable camelcase */
export interface DadataSuggestionResponse {
  value: string;
  unrestricted_value: string;
  data: DadataSuggestion;
}

export interface DadataSuggestion {
  fias_level: string|null;
  fias_id: string|null;
  region_fias_id: string|null;
  settlement_fias_id: string|null;
  city: string|null;
  city_with_type: string|null;
  city_type: string|null;
  city_type_full: string|null;
  city_fias_id: string|null;
  city_district_fias_id: string|null;
  street_type: string|null;
  street_type_full: string|null;
  street_with_type: string|null;
  street_fias_id: string|null;
  street: string|null;
  house_type: string|null;
  house_type_full: string|null;
  house: string|null;
  house_fias_id: string|null;
  block_type: string|null;
  block: string|null;
  flat: string|null;
  flat_type: string|null;
  flat_type_full: string|null;
}

export enum FiasLevel {
  COUNTRY = 0,
  REGION = 1,
  ZONE = 3,
  CITY = 4,
  DISTRICT = 5,
  LOCALITY = 6,
  STREET = 7,
  HOUSE = 8,
  PLAN_STRUCTURE = 65,
  EMPTY = -1
}

export interface LocationItem<T = Partial<DadataSuggestion>> {
  id: string;
  name: string;
  type: string|null;
  data: T;
}
