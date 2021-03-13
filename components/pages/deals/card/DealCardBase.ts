import Vue, { PropType } from 'vue'
import { Location } from 'vue-router'
import { DealServiceItem, IDealItem } from '~/types/deals'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<IDealItem>,
      required: true
    }
  },
  data: () => ({
    expanded: false
  }),
  computed: {
    sortedServices (): DealServiceItem[] {
      return [...this.item.services].sort((a, b) => a.service_type - b.service_type)
    },
    isInCompare (): boolean {
      return this.$vuex.compare.isComparing(this.item)
    },
    provider (): IProvider|undefined {
      return this.$vuex.providers.byId(this.item.provider ?? 0)
    },
    tariffPage (): Location {
      if (this.$route.name === 'deals') {
        return this.$regionLink({
          name: 'tariff-id',
          params: {
            id: String(this.item.id),
            city: this.$vuex.location.userCity.citySlug || '',
            street: this.$vuex.location.userStreet.streetSlug,
            house: this.$vuex.location.userHouse.houseSlug || ''
          }
        })
      } else {
        return this.$regionLink({
          name: 'tariffs-id',
          params: {
            id: String(this.item.id),
            // @ts-expect-error
            city: this.$vuex.location.userCity.citySlug || undefined
          }
        })
      }
    }
  },
  methods: {
    addThisItemToCompare () {
      this.$vuex.compare.SwitchItemCompare(this.item)
    }
  }
})
