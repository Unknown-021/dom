import Vue from 'vue'
import { Location } from 'vue-router'
import { action, createModule, mutation } from 'vuex-class-component'
import api from '~/api'
import { DealDevice, IDealItem } from '~/types/deals'
import { DealOptionsState, DealSelectedDevice } from '~/types/dealsOptions'
import { TvPackage } from '~/types/tvPackages'

export class DealsOptionsStore extends createModule({
  target: 'nuxt',
  namespaced: 'dealsOptions'
}) {
  public tariffsMap: Record<IDealItem['id'], IDealItem> = {}
  protected optionsMap: Record<IDealItem['id'], DealOptionsState> = {}

  @action async ParseQueryToOptions ({ id, query }: { id: IDealItem['id'], query: Location['query'] }) {
    const refurbishedOptions: Partial<DealOptionsState> = {}
    if (!query) {
      return this.SET_NEW_OPTION({ id, payload: {} })
    }
    refurbishedOptions.devices = (query.devices as string[] ?? []).reduce((acc, el) => {
      const item: DealSelectedDevice = JSON.parse(el)
      acc[item.id] = item
      return acc
    }, {} as DealOptionsState['devices'])
    refurbishedOptions.tv_package = Number(query?.tv_package ?? 0)
    refurbishedOptions.additional_tv_packages = (query?.additional_tv_packages as string[] ?? []).map(Number)
    this.SET_NEW_OPTION({ id, payload: refurbishedOptions })
  }

  @action async GetQueryFromOptions (id: IDealItem['id']): Promise<NonNullable<Location['query']>> {
    const options = this.optionsMap[id]
    if (!options) {
      throw new Error('Queryable options does not exists')
    }
    const query: Partial<Record<keyof DealOptionsState, string|string[]>> = {}
    if (options.additional_tv_packages.length) {
      query.additional_tv_packages = options.additional_tv_packages.map(String)
    }
    if (Object.keys(options.devices).length) {
      query.devices = Object.values(options.devices).map(el => JSON.stringify(el))
    }
    if (options.tv_package) {
      query.tv_package = String(options.tv_package)
    }
    return query
  }

  @action async AddDevice ({ id, deviceID, count }: { id: IDealItem['id'], deviceID: DealDevice['device'], count: number }) {
    const obj = this.dealOptions(id)
    if (deviceID in obj.devices && count === 0) {
      this.DELETE_SELECTED_DEVICE({ id, itemsIDs: [deviceID] })
      return
    }

    this.SET_NEW_OPTION({
      id,
      payload: {
        devices: {
          ...obj.devices,
          [deviceID]: { id: deviceID, count }
        }
      }
    })
  }

  @action async SelectTvMainPackage ({ id, packageID }: { id: IDealItem['id'], packageID: TvPackage['id'] }) {
    this.SET_NEW_OPTION({
      id,
      payload: {
        tv_package: packageID
      }
    })
  }

  @action async SwitchAdditionalPackage ({ id, packageID }: { id: IDealItem['id'], packageID: TvPackage['id'] }) {
    const arr = this.optionsMap[id].additional_tv_packages
    if (arr.includes(packageID)) {
      return this.REMOVE_ADDITIONAL_PACKAGE({ id, packageID })
    }
    this.ADD_ADDITIONAL_PACKAGE({ id, packageID })
  }

  @mutation DELETE_SELECTED_DEVICE ({ id, itemsIDs }: { id: IDealItem['id'], itemsIDs: DealDevice['device'][] }) {
    const obj = this.optionsMap[id].devices
    itemsIDs.forEach((itemID) => {
      Vue.delete(obj, itemID)
    })
  }

  @mutation ADD_ADDITIONAL_PACKAGE ({ id, packageID }: { id: IDealItem['id'], packageID: TvPackage['id'] }) {
    const arr = this.optionsMap[id].additional_tv_packages
    arr.push(packageID)
  }

  @mutation REMOVE_ADDITIONAL_PACKAGE ({ id, packageID }: { id: IDealItem['id'], packageID: TvPackage['id'] }) {
    const arr = this.optionsMap[id].additional_tv_packages
    const index = arr.indexOf(packageID)
    if (index >= 0) {
      arr.splice(index, 1)
    }
  }

  @mutation SET_NEW_OPTION ({ id, payload }: { id: IDealItem['id'], payload: Partial<DealOptionsState> }) {
    if (!(id in this.optionsMap)) {
      const defaultOptions: DealOptionsState = {
        devices: {},
        tv_package: 0,
        additional_tv_packages: []
      }
      Vue.set(this.optionsMap, id, defaultOptions)
    }
    Vue.set(this.optionsMap, id, Object.assign(
      {},
      this.optionsMap[id],
      payload
    ))
  }

  @action async GetTariffAsSelected (id: IDealItem['id']) {
    if (id in this.tariffsMap) {
      return
    }
    const data = await api.tariff.GetById(id)
    this.SET_SELECTED_TARIFF(data)
  }

  @mutation SET_SELECTED_TARIFF (payload: IDealItem) {
    if (!(payload.id in this.tariffsMap)) {
      Vue.set(this.tariffsMap, payload.id, payload)
    } else {
      this.tariffsMap[payload.id] = { ...payload }
    }
  }

  get dealOptions () {
    return (id: IDealItem['id']) => {
      return this.optionsMap[id]
    }
  }

  get deal () {
    return (id: IDealItem['id']): IDealItem => {
      return this.tariffsMap[id]
    }
  }
}
