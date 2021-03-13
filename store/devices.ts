import api from '~/api'
import { CmsDeviceDetail } from '~/types/device'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const DeviceStore = DictionaryStoreFactory<
  CmsDeviceDetail,
  'SourceID',
  'Provider'|'kind'
>(api.device, 'device', 'SourceID')
