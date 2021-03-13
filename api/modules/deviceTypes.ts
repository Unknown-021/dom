import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { IDeviceType } from '~/types/tariff'

export class DeviceTypesApi extends DictionaryApiFactory<IDeviceType, 'id'>() {

}
