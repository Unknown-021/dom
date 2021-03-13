import api from '~/api'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const TvPackageStore = DictionaryStoreFactory(api.tvPackage, 'tvPackage', 'id')
