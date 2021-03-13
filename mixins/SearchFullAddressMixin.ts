import Vue from 'vue'
import api from '~/api'
import { ICity, IFlat, IHouse, IStreet } from '~/types/location'
import { emptyLocation } from '~/subscribes/location'
import { getDebouncer } from '~/utils/debounce'
export const SearchFullAddressMixin = Vue.extend({
  data () {
    return {
      searchCity: '',
      searchStreet: '',
      searchHouse: '',
      searchLoaders: {
        city: false,
        street: false,
        house: false
      },
      searchItems: {
        city: [] as ICity[],
        street: [] as IStreet[],
        house: [] as IHouse[]
      },
      stateCity: { ...this.$vuex.location.userCity },
      stateStreet: { ...this.$vuex.location.userStreet },
      stateHouse: { ...this.$vuex.location.userHouse },
      stateFlat: { ...this.$vuex.location.userFlat },
      debounce: getDebouncer(500)
    }
  },
  watch: {
    stateCity (val: ICity, oldval: ICity) {
      if (val.cityFias_id !== oldval.cityFias_id) {
        this.stateStreet = { ...emptyLocation }
        this.searchItems.street = []
      }
    },
    stateStreet (val: IStreet, oldval: IStreet) {
      if (val.streetFias_id !== oldval.streetFias_id) {
        this.stateHouse = { ...emptyLocation }
        this.searchItems.house = []
      }
    },
    stateHouse (val: IHouse, oldval: IHouse) {
      if (val.houseFias_id !== oldval.houseFias_id) {
        this.stateFlat = { ...emptyLocation }
      }
    },
    async searchStreet (val: string) {
      if (!val) {
        this.searchLoaders.street = false
        return
      }
      this.debounce(async () => {
        try {
          this.searchLoaders.street = true
          this.searchItems.street = await api.fromsHelpers.RequestToStreet(val, this.stateCity.cityFias_id)
        } finally {
          this.searchLoaders.street = false
        }
      })
    },
    async searchCity (val: string) {
      if (!val) {
        this.searchLoaders.city = false
        return
      }
      this.debounce(async () => {
        try {
          this.searchLoaders.city = true
          this.searchItems.city = await api.fromsHelpers.RequestToCITY(val)
        } finally {
          this.searchLoaders.city = false
        }
      })
    },
    async searchHouse (val: string) {
      if (!val) {
        this.searchLoaders.house = false
        return
      }
      this.debounce(async () => {
        try {
          this.searchLoaders.house = true
          this.searchItems.house = await api.fromsHelpers.RequestToHouse(val, this.stateCity.cityFias_id, this.stateStreet.streetFias_id)
        } finally {
          this.searchLoaders.house = false
        }
      })
    }
  },
  created () {
    if (this.stateStreet.streetName) {
      this.searchItems.street.push(this.stateStreet)
    }
    if (this.stateHouse.houseNumber) {
      this.searchItems.house.push(this.stateHouse)
    }
  },
  methods: {
    combineLocations (...locs: Partial<ICity & IStreet & IHouse & IFlat>[]): ICity & IStreet & IHouse & IFlat {
      return locs.reduce((acc: ICity & IStreet & IHouse & IFlat, el) => {
        Object.entries(el).forEach(([key, value]) => {
          if (value) {
            // @ts-ignore
            acc[key as keyof ICity & IStreet & IHouse & IFlat] = value
          }
        })
        return (acc as ICity & IStreet & IHouse & IFlat)
      }, { ...emptyLocation })
    }
  }
})
