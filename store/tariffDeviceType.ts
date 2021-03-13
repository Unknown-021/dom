import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const DeviceTypeStore = DictionaryStoreFactory(api.deviceTypes, 'deviceType', 'id')
