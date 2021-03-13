<template>
  <ValidationObserver :id="`filter_${value.id}`" class="filter__section" tag="div">
    <div v-if="value.name" class="filter__section-title">
      <span>{{ value.name }}</span>
      <deals-filter-info v-if="value.hint">
        <template v-slot:title>
          {{ value.name }}
        </template>
        {{ value.hint }}
      </deals-filter-info>
    </div>
    <div class="filter__range">
      <div class="filter__range-header">
        <ValidationProvider
          v-slot="{ failed }"
          class="filter__range-input"
          tag="div"
          :name="fieldValidatorName"
          :rules="minRules"
          :debounce="500"
        >
          <d-number-input
            v-model="min"
            :error="failed"
            label="От"
            :rules="minRules"
          />
        </ValidationProvider>
        <div class="filter__range-divider">
          —
        </div>
        <ValidationProvider
          v-slot="{ failed }"
          class="filter__range-input"
          tag="div"
          :name="fieldValidatorName"
          :rules="maxRules"
          :debounce="500"
        >
          <d-number-input v-model="max" :error="failed" label="До" :rules="minRules" />
        </ValidationProvider>
        <div class="filter__range-payment">
          {{ value.unit }} <span>{{ value.measure }}</span>
        </div>
      </div>
      <ValidationProvider v-slot="{ failed }" slim="slim" :name="fieldValidatorName" :rules="validationRules" :debounce="500">
        <d-range-slider
          :error="failed"
          label="label"
          :min="value.min"
          :max="value.max"
          :min-value.sync="min"
          :max-value.sync="max"
        />
      </ValidationProvider>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import FilterBase from './FilterItemBase'

export default FilterBase.extend({
  data () {
    if (this.value.type === 'range') {
      const [min, max] = this.$vuex.filters.filterValues[this.value.id] as [number, number] ||
        [...(this.value.value ||
        [this.value.min, this.value.max])]
      return {
        min,
        max
      }
    }
  },
  watch: {
    value () {
      [this.min, this.max] = this.$vuex.filters.filterValues[this.value.id] as [number, number]
    }
  },
  computed: {
    minRules (): string {
      if (this.value.type === 'range') {
        return `min_value:${this.value.min || 0}|max_value:${this.max || Infinity}|${this.validationRules}`
      }
      return ''
    },
    maxRules (): string {
      if (this.value.type === 'range') {
        return `min_value:${this.min || 0}|max_value:${this.value.max || Infinity}|${this.validationRules}`
      }
      return ''
    },
    internalValue (): [number, number] {
      return [this.min, this.max]
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
