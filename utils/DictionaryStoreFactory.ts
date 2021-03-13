import { action, createModule, mutation } from 'vuex-class-component'
import { DictionaryApiModule } from '~/types/api'

export function DictionaryStoreFactory<T, K extends keyof T, F extends keyof T> (
  apiModule: DictionaryApiModule<T, K>,
  namespace: string,
  itemIdKey: K
) {
  class Dictionary extends createModule({
    target: 'nuxt',
    namespaced: namespace
  }) {
    private _items: T[] = [];
    public isAllGetted = false;
    public allLoading = false;

    @action async Init () {
      if (this.isAllGetted) {
        return
      }
      try {
        this.allLoading = true
        const { results } = await apiModule.GetAll()
        this._items = [...results]
        this.isAllGetted = true
      } finally {
        this.allLoading = false
      }
    }

    GetByID (id: T[K][]): Promise<T[]>;
    GetByID (id: T[K]): Promise<T>;
    @action async GetByID (id: T[K]|T[K][]): Promise<T|T[]> {
      if (Array.isArray(id)) {
        // @ts-expect-error
        const localItems: T[] = id.map(el => this.byId(el)).filter(Boolean)
        const neededIds = id
          .filter(el => !localItems.some(i => i[itemIdKey] === el))
          .filter((el, i, arr) => arr.indexOf(el) === i)
        if (!neededIds.length) {
          return localItems
        }
        const remoteData = (await apiModule.GetById(neededIds))
        const remoteItems = [remoteData].flat().map((el) => {
          this.ADD_ITEM(el)
          return el
        })
        return [...localItems, ...remoteItems]
      }
      const localItem = this.byId(id)
      if (!localItem) {
        const data = await apiModule.GetById(id)
        this.ADD_ITEM(data)
        return data
      }
      return localItem
    }

    @action async FilterItems (filters: Partial<Pick<T, F>> & Record<string, string|number>): Promise<T[K][]> {
      // @ts-expect-error
      const { results } = await apiModule.GetFilters(filters)
      return (results ?? []).map((el) => {
        const id = el[itemIdKey]
        if (!this.byId(id)) {
          this.ADD_ITEM(el)
        }
        return id
      })
    }

    @mutation ADD_ITEM (item: T) {
      this._items.push(item)
    }

    get filterSync () {
      return (filters: Partial<Pick<T, F>>) => {
        return this._items.filter((el) => {
          return Object.entries(filters).every(([key, value]) => value === el[key as F])
        })
      }
    }

    get all () {
      return this._items
    }

    get byId () {
      // eslint-disable-next-line eqeqeq
      return (id: T[K]) => this._items.find(el => el[itemIdKey] == id)
    }
  }
  return Dictionary
}
