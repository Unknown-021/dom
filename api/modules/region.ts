import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { IRegion } from '~/types/location'

export class RegionApi extends DictionaryApiFactory<IRegion, 'id'>() {

}
