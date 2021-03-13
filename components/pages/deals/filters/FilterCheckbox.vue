<template>
  <ValidationProvider
    :id="`filter_${value.id}`"
    v-slot="{ failed }"
    class="filter__section"
    tag="div"
    :name="fieldValidatorName"
    :rules="validationRules"
  >
    <div v-if="value.name" class="filter__section-title">
      <span>{{ value.name }}</span>
      <deals-filter-info v-if="value.hint">
        <template v-slot:title>
          {{ value.name }}
        </template>
        {{ value.hint }}
      </deals-filter-info>
    </div>
    <d-checkbox-group v-model="selected" class="filter__period" :error="failed" :items="value.variants" :options="value.options" />
  </ValidationProvider>
</template>

<script lang="ts">
import { PropType } from 'vue'
import FilterBase from './FilterItemBase'
import { CheckboxFilterOption } from '~/types/filters'

export default FilterBase.extend({
  props: {
    value: {
      type: Object as PropType<CheckboxFilterOption>,
      required: true
    }
  },
  data () {
    if (this.value.type === 'checkbox') {
      let filterValues = this.$vuex.filters.filterValues[this.value.id] as any
      if (this.value.id === 'service__service_type') {
        if (Array.isArray(this.$vuex.filters.filterValues[this.value.id])) {
          filterValues = filterValues.filter((el: number) => +el !== 1)
        }
      }

      const selected: (string|number)[] = this.value.id in this.$vuex.filters.filterValues
        ? [filterValues].flat() as (string|number)[]
        : [this.value.value].flat() || []
      return {
        selected
      }
    }
  },
  computed: {
    internalValue (): (string|number)[] {
      return this.selected
    },
    storeValue (): string[] {
      return this.$vuex.filters.filterValues[this.value.id] as string[]
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
