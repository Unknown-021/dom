import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { IProvider } from '~/types/providers'

export class ProvidersApi extends DictionaryApiFactory<IProvider, 'id'>() {

}
