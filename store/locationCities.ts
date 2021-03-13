import api from '~/api'
import { ISelectedCity } from '~/types/location'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const CitiesStore = DictionaryStoreFactory<
ISelectedCity,
  'id',
  // @ts-expect-error
  'slug'|'fias_id'|'name__contains'
>(api.cities, 'cities', 'id')
