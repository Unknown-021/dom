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
    <d-checkbox-group v-model="selected" class="filter__provider" :error="failed" :items="value.variants">
      <template v-slot="{ item }">
        <span class="filterCheckbox__image"><img :src="item.image" :title="item.name" :alt="`Логотип ${item.name}`"></span>
      </template>
    </d-checkbox-group>
  </ValidationProvider>
</template>

<script lang="ts">
import { PropType } from 'vue'
import FilterBase from './FilterItemBase'
import { CheckboxImageFilterOption } from '~/types/filters'

export default FilterBase.extend({
  props: {
    value: {
      type: Object as PropType<CheckboxImageFilterOption>,
      required: true
    }
  },
  data () {
    if (this.value.type === 'checkbox_image') {
      const selected = this.value.id in this.$vuex.filters.filterValues
        ? this.$vuex.filters.filterValues[this.value.id] as (string|number)[]
        : this.value.value || []
      return {
        selected
      }
    }
  },
  computed: {
    internalValue (): (string|number)[] {
      return this.selected
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
