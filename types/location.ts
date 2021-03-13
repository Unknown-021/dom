
export interface ICity {
    cityName: string,
    cityShortname: string,
    cityFullname: string[],
    cityFias_id: string,
    citySlug: string
}

export interface ISelectedCity {
  id: number,
  api_id: number,
  name: string,
  name_l: string,
  shortname: 'г',
  population: number,
  google_geo: number,
  yandex_geo: number,
  slug: string,
  fias_id: string,
  geoip_name: number,
  internet_houses_count: number,
  has_internet: boolean,
  fullname: string,
  data: number,
  region: number
}
export interface IHouse {
  houseNumber: string,
  house_type: string,
  house_id: string,
  houseFias_id: string,
  houseSlug: string
}

export interface IFlat {
  flat: string
}

export interface IStreet {
  streetName: string,
  streetShortname: string,
  streetFias_id: string,
  streetSlug: string
}

export interface IRegion {
  id: number;
  name: string;
  google_geo: number;
  yandex_geo: number;
  region_code: string;
  time_shift: number;
  default_city: number;
  capital_yandex_geo: null;
  slug: string;
  fias_id: string;
  geoip_name: string;
}

export interface ILocationBack {
  city_data:{
    name: string,
    shortname: string,
    fullname: string,
    fias_id: string,
    slug: string
  },
  street_data:{
    name: string,
    shortname: string,
    fias_id: string,
    slug: string
  },
  house_data:{
    number: string,
    house_type: string,
    house_id: string,
    fias_id: string,
    slug: string
    }

}

export interface ILocationFront {
    street_data: {
      streetFias_id: string,
      streetName: string,
      streetSlug:string,
      streetShortname: string
    },
    city_data: {
      cityName: string,
      cityShortname: string,
      cityFullname: string[],
      cityFias_id: string,
      citySlug: string
    },
    house_data: {
      houseNumber: string,
      house_type: string,
      house_id: string,
      houseFias_id: string,
      houseSlug: string
    }
}
