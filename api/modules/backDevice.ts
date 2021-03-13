import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { DeviceDetail } from '~/types/device'
export class BackDeviceApi extends DictionaryApiFactory<DeviceDetail, 'id'>() {

}
