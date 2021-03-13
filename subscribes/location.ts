import { SubscribeModule } from '~/subscribes'
import { ICity, IFlat, IHouse, IStreet } from '~/types/location'

export const emptyLocation: ICity & IStreet & IHouse & IFlat = {
  cityName: '',
  cityShortname: '',
  cityFullname: [],
  cityFias_id: '',
  citySlug: '',
  streetName: '',
  streetShortname: '',
  streetFias_id: '',
  streetSlug: '',
  houseNumber: '',
  house_type: '',
  house_id: '',
  houseFias_id: '',
  houseSlug: '',
  flat: ''

}

export const LocationSubscribeModule: SubscribeModule = (vuex) => {
  ['SET_CITY', 'SET_STREET', 'SET_HOUSE', 'SET_FLAT'].forEach((action) => {
    vuex.location.$subscribeAction(action,
      {
        before: () => { /** */ },
        after: () => vuex.location.SAVE_LOCATION_ON_CLIENT()
      })
  })
  vuex.location.$subscribeAction('SET_CITY', {
    before: ({ cityFias_id }: ICity) => {
      if (cityFias_id !== vuex.location.userCity.cityFias_id) {
        vuex.location.SET_STREET(emptyLocation)
      }
    },
    after: () => {}
  })
  vuex.location.$subscribeAction('SET_STREET', {
    before: ({ streetName }: IStreet) => {
      if (streetName !== vuex.location.userStreet.streetName) {
        vuex.location.SET_HOUSE(emptyLocation)
      }
    },
    after: () => {}
  })
  vuex.location.$subscribeAction('SET_HOUSE', {
    before: ({ houseFias_id }: IHouse) => {
      if (houseFias_id !== vuex.location.userHouse.houseFias_id) {
        vuex.location.SET_FLAT(emptyLocation)
      }
    },
    after: () => {}
  })
}
