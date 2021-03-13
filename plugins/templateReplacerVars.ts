import { Plugin } from '@nuxt/types'
import { DEAL_SERVICE_TYPE, ServiceInternet } from '~/types/deals'
import { CheckboxFilterOption } from '~/types/filters'
import { DEVICE_BUY_METHOD } from '~/types/tariff'
import { DeviceHelper } from '~/utils/DeviceHelper'

declare module 'vue/types/vue' {
  interface Vue {
    $replacer(text?: string): string
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $replacer(text?: string): string
  }
  interface Context {
    $replacer(text?: string): string
  }
}

const replacerVars: Plugin = ({ $vuex }, inject) => {
  const replacer = (text?: string) => {
    return [
      // ADDRESS
      ['#CITY#', $vuex.location.selectedCity?.name ? $vuex.location.selectedCity?.shortname + ' ' + $vuex.location.selectedCity?.name : 'NO VARS FOR REPLACE!'],

      ['#CITY_L#', $vuex.location.selectedCity?.name_l ? $vuex.location.selectedCity?.name_l
        : $vuex.location.selectedCity?.shortname + ' ' + $vuex.location.selectedCity?.name || ''],

      ['#STREET#', $vuex.location.userStreet.streetShortname + ' ' + $vuex.location.userStreet.streetName ?? 'NO VARS FOR REPLACE!'],
      // FILTERS
      ['#CREDIT_PAYMENT#', $vuex.filters.filterValues.credit_payment === 'true' ? 'Постоплата' : 'Предоплата'],

      ['#DEVICEUSE__DEVICE#', $vuex.filters.filterValues.deviceuse__device === 'true' ? 'Включен в тариф' : 'Не нужен'],

      ['#DEVICEUSE__METHOD#', ($vuex.filters.filterValues.deviceuse__method as number[] || []).length
        ? ($vuex.filters.filterValues.deviceuse__method as number[])
        ?.map((el: DEVICE_BUY_METHOD) => DeviceHelper.GetHumanPayment(el))
        .join(',')
        : 'NO VARS FOR REPLACE!'],

      ['#MIN_CONTRACT#', ($vuex.filters.filterValues.min_contract as number[] || [])?.map(el =>
        ($vuex.filters.filterTypes.min_contract as CheckboxFilterOption)?.variants?.find(item =>
          item.id === +el)?.name).length
        ? ($vuex.filters.filterValues.min_contract as number[])?.map(el =>
        ($vuex.filters.filterTypes.min_contract as CheckboxFilterOption)?.variants.find(item =>
          item.id === +el)?.name
      ).join(' , ') : 'NO VARS FOR REPLACE!'],

      ['#INSTALL_PAYMENT#', $vuex.filters.filterValues.install_payment === 'true' ? 'Платное' : 'Бесплатное'],

      ['#PRICE#', ($vuex.filters.filterValues?.price as number[] || [])?.length
        ? 'от ' + ($vuex.filters.filterValues.price as number[])[0] + ' до ' + ($vuex.filters.filterValues.price as number[])[1]
        : 'NO VARS FOR REPLACE!'],

      ['#PROVIDERS#', ($vuex.filters.filterValues.provider as string[] || []).length
        ? ($vuex.filters.filterValues.provider as string[]).map(el => $vuex.providers.byId(+el)?.Name).join(' , ')
        : 'NO VARS FOR REPLACE!'],

      ['#SERVICE__SPEED#', ($vuex.filters.filterValues.service__speed as number[])
        ? 'от ' + ($vuex.filters.filterValues.service__speed as number[])[0] + ' до ' + ($vuex.filters.filterValues.service__speed as number[])[1]
        : 'NO VARS FOR REPLACE!'],

      ['#TV_BOX_COUNT#', $vuex.filters.filterValues.tv_box_count
        ? $vuex.filters.filterValues.tv_box_count
        : 'NO VARS FOR REPLACE!'],

      ['#SERVICE__SERVICE_TYPE#', ($vuex.filters.filterValues.service__service_type as number[])
        ? ($vuex.filters.filterValues.service__service_type as number[]).map(el => DeviceHelper.GetHumanServices(+el)).join(' , ')
        : 'NO VARS FOR REPLACE!'],

      ['#TARIFF#', $vuex.tariff.tariffID && $vuex.deals.dealsOptions.deal($vuex.tariff.tariffID!)
        ? 'Тариф ' + $vuex.deals.dealsOptions.deal($vuex.tariff.tariffID!).name
        : 'NO VARS FOR REPLACE!'],

      ['#PROVIDER_NAME#',
        $vuex.tariff.tariffID &&
        $vuex.providers.byId(+$vuex.deals.dealsOptions.deal($vuex.tariff.tariffID!)?.provider!)
          ? $vuex.providers.byId(+$vuex.deals.dealsOptions.deal($vuex.tariff.tariffID!)?.provider!)?.Name
          : $vuex.providers.byId($vuex.providerData.providerID)?.Name
            ? $vuex.providers.byId($vuex.providerData.providerID)?.Name
            : 'NO VARS FOR RsadasEPLACE!'],

      ['#TARIFF_SPEED#', $vuex.tariff.tariffID &&
      ($vuex.deals.dealsOptions
        .deal($vuex.tariff.tariffID!)?.services?.find(el =>
          el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet)?.speed
        ? ($vuex.deals.dealsOptions
          .deal($vuex.tariff.tariffID!)?.services?.find(el =>
            el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet)?.speed + ' ' +
          ($vuex.deals.dealsOptions
            .deal($vuex.tariff.tariffID!)?.services?.find(el =>
              el.service_type === DEAL_SERVICE_TYPE.INTERNET) as ServiceInternet).units
        : 'NO VARS FOR REPLACE!']

    ].reduce((acc, [val, data]) => {
      if (acc.includes(val as string)) {
        acc = acc.replace(new RegExp((val as string), 'g'), (data as string))
      }
      return acc
    }, text ?? '')
  }
  inject('replacer', replacer)
}

export default replacerVars
