import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { IServiceType } from '~/types/tariff'

export class ServiceTypesApi extends DictionaryApiFactory<IServiceType, 'id'>() {

}
