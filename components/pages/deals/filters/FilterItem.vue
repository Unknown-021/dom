<script lang="ts">
import Vue, { PropType } from 'vue'
import FilterRadio from './FilterRadio.vue'
import FilterRange from './FilterRange.vue'
import FilterNumber from './FilterNumber.vue'
import FilterCheckbox from './FilterCheckbox.vue'
import FilterSelect from './FilterSelect.vue'
import FilterCheckboxImage from './FilterCheckboxImage.vue'
import { FilterOption } from '~/types/filters'

export default Vue.component('FilterItem', {
  functional: true,
  props: {
    value: {
      type: Object as PropType<FilterOption>,
      required: true
    }
  },
  render: (createElement, { props: { value } }) => {
    const componentToShow = (() => {
      switch (value.type) {
        case 'radio': return FilterRadio
        case 'range': return FilterRange
        case 'number': return FilterNumber
        case 'checkbox': return FilterCheckbox
        case 'checkbox_image': return FilterCheckboxImage
        case 'select': return FilterSelect
        default: return undefined
      }
    })()

    return createElement(
      componentToShow,
      {
        props: { value }
      }
    )
  }
})
</script>
