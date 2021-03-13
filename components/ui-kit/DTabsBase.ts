/* eslint-disable eqeqeq */
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    value: {
      validator: val => ['string', 'number'].includes(typeof val),
      default: () => ''
    },
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    itemName: {
      type: String,
      default: () => 'name'
    },
    itemValue: {
      type: String,
      default: () => 'id'
    },
    mandatory: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    internalValue: '' as string|undefined
  }),
  watch: {
    internalValue (val: string, oldVal: string) {
      if (val != oldVal && val != this.value) {
        this.$emit('input', val)
      }
    },
    value (val: string) {
      if (val != this.internalValue && this.items.some(el => el[this.itemValue] == val)) {
        this.internalValue = val
      }
    }
  },
  created () {
    const haveItem = this.items.some(el => el[this.itemValue] == this.value)
    if (haveItem) {
      this.internalValue = this.value
    } else if (this.mandatory) {
      const item = this.items.find(el => this.itemValue in el)
      if (item) {
        this.internalValue = item[this.itemValue]
      }
    }
  }
})
