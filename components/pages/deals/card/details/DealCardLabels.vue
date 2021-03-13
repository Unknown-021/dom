<template>
  <div class="card__label">
    <div
      v-for="(item, index) in renderLabels"
      :key="index"
      class="card__label-item"
      :class="center ? 'card__label-item-center' : ''"
      :style="{ background: item.color }"
    >
      {{ labelText(item) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DEAL_ATTRIBUTE_TYPES } from '~/consts'
import { DealAttribute } from '~/types/deals'

export default Vue.extend({
  props: {
    labels: {
      type: Array as PropType<DealAttribute[]>,
      default: () => []
    },
    center: {
      type: Boolean as PropType<Boolean>,
      default: false
    }
  },
  computed: {
    renderLabels (): (DealAttribute & { color: string })[] {
      return this.labels
        .filter(el => DEAL_ATTRIBUTE_TYPES.LABELS.includes(el.key ?? ''))
        .map(el => ({
          ...el,
          color: this.$vuex.deals.dealsLabels.color(el.key)
        }))
    }
  },
  methods: {
    labelText (item: DealAttribute): string {
      return [item.name, item.value, item.units].filter(Boolean).join(' ')
    }
  }
})
</script>

<style lang="scss" scoped>
  .card__label {
    min-height: 38px;

    &-item {
      margin-right: 7px;
    }
  }
  .card__label-item-center {
    padding: 0 12px 0;
    align-items: center;
  }
</style>
