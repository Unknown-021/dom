import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const RegionsStore = DictionaryStoreFactory(api.regions, 'regions', 'id')
