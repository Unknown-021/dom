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
    <d-number-input
      v-model="count"
      :error="failed"
      :label="value.label || 'Количество'"
      :min="value.min"
      :max="value.max"
      :step="value.step || 1"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import FilterBase from './FilterItemBase'

export default FilterBase.extend({
  data () {
    if (this.value.type === 'number') {
      const count = this.value.id in this.$vuex.filters.filterValues
        ? this.$vuex.filters.filterValues[this.value.id] as number
        : this.value.min || 1
      return {
        count
      }
    }
  },
  computed: {
    internalValue (): number|undefined {
      return this.count === 0 ? undefined : this.count
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
