import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { TvPackage } from '~/types/tvPackages'

export class TvPackageApi extends DictionaryApiFactory<TvPackage, 'id'>() {

}
