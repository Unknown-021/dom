<template>
  <div class="tariffInfo">
    <card-features :items="tariff.attributes" />
    <div class="tariffOrder tariffOrder_desktop">
      <div class="card__property">
        <div class="card__property-title">
          Абонентская плата
        </div>
        <div class="card__property-cost">
          <div class="card__property-cost-value">
            <span v-if="tariff.price_norm" class="old-cost">
              {{ tariff.price_norm }}</span>
            {{ tariff.price }}
          </div>
          <div class="card__property-cost-period">
            руб<span>мес</span>
          </div>
        </div>
      </div>
    </div>
    <card-prices :item="tariff" calc-prices />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    tariff () {
      return this.$vuex.deals.dealsOptions.deal(this.id)
    },
    benefits (): string[] {
      return this.tariff.benefits
        .filter(el => Boolean(el.text))
        .map(el => this.formatBenefit(el.text))
    }
  },
  methods: {
    formatBenefit (text: string) {
      return text.replace(/\d+/g, match => `<span class="accent">${match}</span>`)
    }
  }
})
</script>

<style lang="scss" scoped>
  .old-cost {
    text-decoration: line-through;
    font-size: .5em;
    font-weight: 400;
  }
</style>
