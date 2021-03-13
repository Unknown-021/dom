import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const TvChannelStore = DictionaryStoreFactory(api.tvChannels, 'tvChannel', 'id')
