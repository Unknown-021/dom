import api from '~/api'
import { IProvider } from '~/types/providers'
import { DictionaryStoreFactory } from '~/utils/DictionaryStoreFactory'

export const ProvidersStore = DictionaryStoreFactory<
  IProvider,
  'SourceID',
  'slug'
>(api.strapiProvidersApi, 'providers', 'SourceID')
