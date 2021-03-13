import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { ICity } from '~/types/location'

export class CityApi extends DictionaryApiFactory<ICity, 'citySlug'>() {

}
