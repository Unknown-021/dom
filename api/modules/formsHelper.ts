import { BaseApi } from '~/api/BaseApi'
import { IHousesListPageComponent } from '~/types/layout'
import { ICity, IHouse, IStreet } from '~/types/location'

export class FromsHelpers extends BaseApi {
  async RequestToCITY (info : string): Promise<ICity[]> {
    const city = await this._axios.post('/addresses/suggest/city/', { text: info })
    return (city.data.results as {name: string, shortname: string, fullname: string[], fias_id: string, slug: string}[]).map(el => ({
      cityName: el.name,
      cityShortname: el.shortname,
      cityFullname: el.fullname,
      cityFias_id: el.fias_id,
      citySlug: el.slug
    }))
  }

  async RequestToStreet (info : string, city_fias_id: string): Promise<IStreet[]> {
    const street = await this._axios.post('/addresses/suggest/street/', { text: info, city_fias_id })
    return (street.data.results as {name: string, shortname: string, fias_id: string, slug: string}[]).map(el => ({
      streetName: el.name,
      streetShortname: el.shortname,
      streetFias_id: el.fias_id,
      streetSlug: el.slug
    }))
  }

  async RequestToHouse (info : string, city_fias_id: string, parent_fias_id: string): Promise<IHouse[]> {
    const house = await this._axios.post('/addresses/suggest/house/', { text: info, city_fias_id, parent_fias_id })
    return (house.data.results as {fias_id: string, house_id: string, house_type: string, number: string, slug: string}[])
      .map(el => ({
        houseNumber: el.number,
        house_type: el.house_type,
        house_id: el.house_id,
        houseFias_id: el.fias_id,
        houseSlug: el.slug
      }))
  }

  async RequestWithPeopleInfo (info : string) {
    await this._axios.post('/report/', info)
  }

  async GetStreetPageHousesList (city: string, street: string): Promise<IHousesListPageComponent> {
    const { data } = await this._axios.post(`/addresses/${city}/${street}/houses/`)
    return data.results
  }
}
