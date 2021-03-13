import { DictionaryApiFactory } from '~/api/DictionaryApiFactory'
import { TvChannel } from '~/types/tvPackages'

export class TvChannelsApi extends DictionaryApiFactory<TvChannel, 'id'>() {

}
