import cookie from 'cookie'
import { action, createModule, createSubModule, mutation } from 'vuex-class-component'
import Cookies from 'js-cookie'
import api from '~/api'
import { CitiesStore } from '~/store/locationCities'
import { RegionsStore } from '~/store/locationRegions'
import { GetGeolocation } from '~/utils/GetGeolocation'
import { ICity, IFlat, IHouse, ILocationFront, ISelectedCity, IStreet } from '~/types/location'

export class LocationStore extends createModule({
  target: 'nuxt',
  namespaced: 'location'
}) {
  locationParsedFromQuery = false;
  locationSettedAuto = false;

  /**
   * HACK: Initializing this prop with undefined to let's vue reactive works fine
   * We are guaranteed setting this prop at middleware/city.ts
   * To avoid nullable property we use undefined as ICity to let prop be not nullable
   */
  public selectedCity: ISelectedCity = undefined as any;

  public cities = createSubModule(CitiesStore);
  public regions = createSubModule(RegionsStore);

  userCity: ICity = {
    cityName: '',
    cityShortname: '',
    cityFullname: [],
    cityFias_id: '',
    citySlug: ''
  }

  userStreet: IStreet = {
    streetName: '',
    streetShortname: '',
    streetFias_id: '',
    streetSlug: ''
  }

  userHouse: IHouse = {
    houseNumber: '',
    house_type: '',
    house_id: '',
    houseFias_id: '',
    houseSlug: ''
  }

  userFlat: IFlat = {
    flat: ''
  }

  @action async InitDictionary () {
    return Promise.all([
      this.cities.Init(),
      this.regions.Init()
    ])
  }

  @action async SetValueFromGeolocation () { // TODO длкация по координатам
    const coords = await GetGeolocation()
    const data = await api.geoLocation.GeolocationAddress(coords.latitude, coords.longitude)
    if (!data) {
      throw new Error('No city found')
    }
    return this.SetCityByFilter({ slug: data.slug })
  }

  SetCityByFilter(payload: { slug: ICity['citySlug'] }): Promise<void>
  @action async SetCityByFilter ({ slug }: { slug: ICity['citySlug'] }) {
    const err: any = new Error('Problem get city by slug')
    err.response = { status: 404 }
    const [cityID] = await this.cities.FilterItems({ slug })
    if (!cityID) {
      this.$store.commit('layout/cityChooser', true, { root: true })
      throw err
    }
    const city = this.cities.byId(cityID)
    if (!city) {
      this.$store.commit('layout/cityChooser', true, { root: true })
      throw err
    }
    this.SET_CITY({
      cityName: city.name,
      cityShortname: city.shortname,
      cityFullname: [city.fullname].flat(),
      cityFias_id: city.fias_id,
      citySlug: city.slug
    })

    this.selectedCity = { ...city }
  }

  @action async GetAdressFromQuery ({ street_slug, city_fias_id, city_slug, house_slug }:
    {street_slug: string, city_fias_id: string, city_slug: string, house_slug?: string}): Promise<ILocationFront> {
    const street = await api.geoLocation.GetStreetBySlug({ street_slug, city_fias_id, city_slug, house_slug })
    const streetData = {
      street_data: {
        streetFias_id: street.street_data.fias_id,
        streetName: street.street_data.name,
        streetSlug: street.street_data.slug,
        streetShortname: street.street_data.shortname
      },
      city_data: {
        cityName: street.city_data.name,
        cityShortname: street.city_data.shortname,
        cityFullname: [street.city_data.fullname].flat(),
        cityFias_id: street.city_data.fias_id,
        citySlug: street.city_data.slug
      },
      house_data: {
        houseNumber: street.house_data.number,
        house_type: street.house_data.house_type,
        house_id: street.house_data.house_id,
        houseFias_id: street.house_data.fias_id,
        houseSlug: street.house_data.slug
      }
    }
    return streetData
  }

  @action async SetValueByIp (ip?: string) {
    if (!ip || ip.startsWith('192.168') || ip.startsWith('127')) {
      throw new Error('Bad IP')
    }
    const location = await api.geoLocation.GetLocationByIP(ip)
    await this.SetFullAddressFromSuggestion({
      cityName: location?.data?.name || '',
      cityFias_id: location?.data?.fias_id || '',
      citySlug: location?.data?.slug || ''
    } as ICity & IHouse & IStreet & IFlat)
    this.locationSettedAuto = true
  }

  get userFullAddress () {
    return [
      ([this.userStreet.streetShortname, this.userStreet.streetName].filter(Boolean).join('. ')),
      [this.userHouse.house_type, this.userHouse.houseNumber].filter(Boolean).join('. '),
      this.userFlat.flat
    ].filter(Boolean).join(', ')
  }

  get isAddressFiled () {
    return [
      this.city,
      this.street,
      this.house
    ].every(Boolean)
  }

  get fullLocationState () {
    return {
      ...this.userCity,
      ...this.userStreet,
      ...this.userHouse,
      ...this.userFlat
    }
  }

  @mutation LOCATION_ACCEPT () {
    this.locationSettedAuto = false
  }

  get city () {
    return this.userCity.cityName
  }

  get street () {
    return this.userStreet.streetName
  }

  get house () {
    return this.userHouse.houseNumber
  }

  get flat () {
    return this.userFlat.flat
  }

  @action async SetFullAddressFromSuggestion (payload: ICity & IHouse & IStreet & IFlat) { // TODO
    if (payload.cityFias_id) {
      await this.SetCityByFilter({ slug: payload.citySlug })
    }
    await [
      this.SET_STREET,
      this.SET_HOUSE,
      this.SET_FLAT
    ].reduce(async (acc, fn) => {
      await acc
      return fn(payload)
    }, Promise.resolve())
  }

  @action async SET_CITY (val: ICity) {
    const data: ICity = {
      cityName: val.cityName,
      cityShortname: val.cityShortname,
      cityFullname: val.cityFullname,
      cityFias_id: val.cityFias_id,
      citySlug: val.citySlug
    }
    this.userCity = data
  }

  @action async SET_STREET (val: IStreet) {
    const data: IStreet = {
      streetName: val.streetName,
      streetShortname: val.streetShortname,
      streetFias_id: val.streetFias_id,
      streetSlug: val.streetSlug
    }
    this.userStreet = data
  }

  @action async SET_HOUSE (val: IHouse) {
    const data: IHouse = {
      houseNumber: val.houseNumber,
      house_type: val.house_type,
      house_id: val.house_id,
      houseFias_id: val.houseFias_id,
      houseSlug: val.houseSlug
    }
    this.userHouse = data
  }

  @action async SET_FLAT (val: IFlat) {
    const data: IFlat = {
      flat: val.flat
    }
    this.userFlat = data
  }

  @action async SAVE_LOCATION_ON_CLIENT () {
    const data = JSON.stringify({
      ...this.userCity,
      ...this.userStreet,
      ...this.userHouse,
      ...this.userFlat
    })
    if (process.client) {
      Cookies.set('USER_LOCATION_DATA', data, { expires: 60 })
    } else {
      // @ts-expect-error
      this.$store.rootState.cookie.location = cookie.serialize('USER_LOCATION_DATA', data, {
        path: '/',
        maxAge: 60 * 60 * 24 * 60
      })
    }
  }
}
