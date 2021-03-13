import Cookies from 'js-cookie'
import { SubscribeModule } from '~/subscribes'

export const CompareSubscribeModule: SubscribeModule = (vuex) => {
  ['AddCompareItem', 'RemoveCompareItem', 'DeleteAllCompareList'].forEach((mutation) => {
    vuex.compare.$subscribe(mutation, () => {
      if (process.client) {
        Cookies.set(
          'USER_COMPARE_DATA',
          JSON.stringify(vuex.compare.compareList.map(el => el.id)),
          { expires: 60 })
      }
    })
  })
}
