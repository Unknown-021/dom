import Vue, { PropType } from 'vue'
import { DealDevice, DEAL_SERVICE_TYPE, IDealItem } from '~/types/deals'

export default (type: DEAL_SERVICE_TYPE) => Vue.extend({
  props: {
    item: {
      type: Object as PropType<DealDevice>,
      required: true
    },
    tariff: {
      type: Object as PropType<IDealItem>,
      required: true
    }
  },
  data: () => ({
    chooseDevice: false,
    selectedEdit: 0
  }),
  computed: {
    type (): DEAL_SERVICE_TYPE {
      return type
    },
    devices (): DealDevice[] {
      return this.tariff.device_use.filter(el => el.services.includes(this.type))
    },
    showAdd (): boolean {
      return !!this.devices.length && !this.chooseDevice && !!this.notSelected.length
    },
    selected (): number[] {
      const selectedKeys = Object.keys(this.$vuex.deals.dealsOptions.dealOptions(this.tariff.id).devices).map(Number)
      return this.devices
        .filter(el => selectedKeys.includes(el.device))
        .map(el => el.device)
    },
    notSelected (): number[] {
      return this.devices
        .map(el => el.device)
        .filter(el => !this.selected.includes(el))
    }
  },
  methods: {
    async selectHandler ({ id, count }: Record<string, number>) {
      await this.$vuex.deals.dealsOptions.AddDevice({
        id: this.tariff.id,
        deviceID: id,
        count
      })
      this.itemCloseHandler()
    },
    itemChangeHandler (item: DealDevice['device']) {
      this.selectedEdit = item
      this.chooseDevice = true
    },
    itemCloseHandler () {
      this.selectedEdit = 0
      this.chooseDevice = false
    }
  }
})
