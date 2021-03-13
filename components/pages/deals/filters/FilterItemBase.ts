import Vue, { PropType } from 'vue'
import debounce from 'lodash/debounce'
import { FilterOption } from '~/types/filters'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<FilterOption>,
      required: true
    }
  },
  data () {
    return {
      debounceEmit: debounce((value: FilterOption['value']) => {
        this.$vuex.filters.changed.AddNewValue({ id: this.value.id, value })
      }, 300)
    }
  },
  computed: {
    validationRules (): string {
      switch (this.value.type) {
        case 'range': return `between:${this.value.min || 0},${this.value.max || Infinity}`
        default: return ''
      }
    },
    fieldValidatorName (): string {
      return (this.value.name || '').toLocaleLowerCase()
    }
  },
  watch: {
    internalValue (value: FilterOption['value']) {
      this.debounceEmit(value)
    }
  }
})
