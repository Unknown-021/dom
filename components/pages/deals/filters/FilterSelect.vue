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
    <d-select
      v-model="selected"
      :items="value.variants"
      label="Количество"
      :error="failed"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { PropType } from 'vue'
import FilterBase from './FilterItemBase'
import { SelectFilterOption } from '~/types/filters'

export default FilterBase.extend({
  props: {
    value: {
      type: Object as PropType<SelectFilterOption>,
      required: true
    }
  },
  data () {
    if (this.value.type === 'select') {
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
  select {
    display: flex;
    width: 100%;
    border: none;
    background-color: #ffffff;
    outline: none;
    border-radius: 4px;
    padding: 10px;
    select:required:invalid {
      color: rgb(85, 85, 85);
    }
    option[value=""][disabled] {
      display: none;
    }
    option {
      color: black;
    }
  }
</style>
