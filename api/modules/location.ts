import { BaseApi } from '~/api/BaseApi'
import { ILocationBack } from '~/types/location'

export class GeoLocationApi extends BaseApi {
  async GeolocationAddress (lat: number, lon: number): Promise<{fias_id: string, location: string, name: string, slug:string}> {
    const data = await this._axios.get('/geolocate/coordinates', {
      params: {
        lon,
        lat
      }
    })
    return data.data
  }

  async GetLocationByIP (ip: string): Promise<{data:{location: string, fias_id: string, name: string, slug: string}}> {
    return await this._axios.get('geolocate/ip', {
      params: { ip }
    })
  }

  async GetStreetBySlug ({ street_slug, city_fias_id, city_slug, house_slug }:
    {street_slug: string, city_fias_id: string, city_slug: string, house_slug?: string}): Promise<ILocationBack> {
    const streetData = await this._axios.post('addresses/slug/info', {
      street_slug, city_fias_id, city_slug, house_slug
    })
    return streetData.data
  }
}
