import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const DevicePaymentStore = DictionaryStoreFactory(api.devicePaymentMethods, 'devicePayment', 'id')
