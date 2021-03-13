import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { IDevicePaymentMethod } from '~/types/tariff'

export class DevicePaymentMethodsApi extends DictionaryApiFactory<IDevicePaymentMethod, 'id'>() {

}
