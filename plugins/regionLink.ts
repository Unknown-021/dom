import { Plugin } from '@nuxt/types'
import { Location } from 'vue-router'
import { LOCATION_DEFAULT_CITY } from '~/consts'
declare module 'vue/types/vue' {
  interface Vue {
    $regionLink(link: Location): Location
  }
}
const pluralPlugin: Plugin = ({ $vuex, app: { router } }, inject) => {
  const fn = (link: Location): Location|string => {
    if (!router) {
      return link
    }
    const { resolved } = router.resolve({
      ...link,
      params: {
        ...link.params,
        city: $vuex.location.selectedCity?.slug ?? LOCATION_DEFAULT_CITY
      }
    })
    return resolved?.fullPath ? resolved.fullPath.replace(resolved.path, resolved.path + '/') : link
  }
  inject('regionLink', fn)
}
export default pluralPlugin
