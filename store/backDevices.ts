import api from '~/api'
import { DeviceDetail } from '~/types/device'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const BackDeviceStore = DictionaryStoreFactory<
  DeviceDetail,
  'id',
  'Provider'|'kind'
>(api.deviceBack, 'backDevice', 'id')
