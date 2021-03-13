import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const ServiceTypeStore = DictionaryStoreFactory(api.serviceTypes, 'serviceType', 'id')
