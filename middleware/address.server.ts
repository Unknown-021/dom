import { Context, Middleware } from '@nuxt/types'
import { LOCATION_DEFAULT_CITY } from '~/consts'
import { ICity, IFlat, IHouse, IStreet } from '~/types/location'

const setLocationFromCookieOrIp = async ({ $vuex, req }: Context) => {
  const locationString = (() => {
    const neededCookie = req.headers.cookie?.split(';').map(el => el.trim()).find(el => el.includes('USER_LOCATION_DATA')) ?? ''
    const params = new URLSearchParams(neededCookie)
    const data = params.get('USER_LOCATION_DATA') ?? ''
    return data
  })()
  try {
    if (!locationString) {
      throw new Error('Empty location cookie')
    }
    const data: (ICity & IStreet & IHouse & IFlat) = JSON.parse(locationString)
    if (!data.cityFias_id) {
      throw new Error('Empty cookie city')
    }
    await $vuex.location.SetFullAddressFromSuggestion(data)
  } catch (e) {
    await $vuex.location.SetValueByIp(req.socket.remoteAddress).catch(() => {
      return $vuex.location.SetCityByFilter({ slug: LOCATION_DEFAULT_CITY })
    })
  } finally {
    await $vuex.location.SAVE_LOCATION_ON_CLIENT()
  }
}

const addressMiddleware: Middleware = async (c) => {
  try {
    if (c.req) {
      await setLocationFromCookieOrIp(c)
      if ('city' in c.route.params) {
        if (!c.route.params.city && c.route.name !== 'index') {
          c.redirect({
            params: { city: c.$vuex.location.selectedCity?.slug }
          })
        }
        await c.$vuex.location.SetCityByFilter({ slug: c.route.params.city || 'msk' })
      }
      if (c.route.params.street) {
        // TODO Сделать запрос по слагу
        const payload = await c.$vuex.location.GetAdressFromQuery(
          { street_slug: c.route.params.street, city_fias_id: c.$vuex.location.selectedCity.fias_id, city_slug: c.$vuex.location.selectedCity.slug, house_slug: c.route.params.house || undefined }
        )
        if (!payload || !payload.city_data.citySlug || !payload.street_data.streetSlug) {
          const e:any = new Error('No location found')
          e.response = { status: 404 }
          throw e
        }
        await Promise.all([
          c.$vuex.location.SET_STREET(payload.street_data),
          c.$vuex.location.SET_CITY(payload.city_data),
          c.$vuex.location.SET_HOUSE(payload.house_data)
        ])
      }
      c.$vuex.location.SAVE_LOCATION_ON_CLIENT()
    }
  } catch (e) {
    c.error({
      statusCode: e?.response?.status ?? 500,
      message: e
    })
  }
}

export default addressMiddleware
