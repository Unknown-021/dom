import { IDealItem } from '~/types/deals'
import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'

export class TariffApi extends DictionaryApiFactory<IDealItem, 'id'>() {

}
