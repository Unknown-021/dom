<template>
  <ValidationProvider
    :id="`filter_${value.id}`"
    v-slot="{ failed }"
    class="filter__section filter__section-radio"
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
    <d-radio-select v-model="selected" :error="failed" :items="value.variants" :mandatory="!!value.value" />
  </ValidationProvider>
</template>

<script lang="ts">
import FilterBase from './FilterItemBase'

export default FilterBase.extend({
  data () {
    if (this.value.type === 'radio') {
      const selected = this.value.id in this.$vuex.filters.filterValues
        ? this.$vuex.filters.filterValues[this.value.id] as string|number|undefined
        : this.value.value
      return {
        selected
      }
    }
  },
  computed: {
    internalValue (): string|number|(string|number)[]|undefined {
      return this.selected
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
