import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      validator: val => ['number', 'string'].includes(typeof val),
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    label: {
      type: String,
      default: () => ''
    },
    error: {
      type: Boolean
    },
    valid: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  data: () => ({
    isActive: false,
    stateValue: undefined as any
  }),
  computed: {
    classList (): string[] {
      return [
        // @ts-ignore
        this.isActive || (typeof this.stateValue === 'object' ? this.stateValue[this.itemValue ?? 'id'] : this.stateValue) ? 'is-active' : '',
        this.disabled ? 'is-disabled' : '',
        this.valid && !this.error ? 'is-valid' : '',
        this.error ? 'is-error' : ''
      ]
    }
  }
})
