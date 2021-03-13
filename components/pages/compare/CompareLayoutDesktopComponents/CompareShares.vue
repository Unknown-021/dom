<template>
  <div v-if="showShare" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/star.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Акции
      </div>
    </div>
    <div class="compareTable__content compareTable__content_pb12 compareTable__content_pt12">
      <div class="container">
        <div class="compareTable__content-row compareTable__content-row_flex-center compareTable__content-row_pt4 compareTable__content-row_pb4">
          <div v-for="(tariff, index) in activeSliders" :key="index" class="compareTable__content-cell">
            <div class="cost">
              <template>
                <div v-if="tariff">
                  <span class="cost__period">
                    {{ tariff.name || tariff.name || '—' }}
                  </span>
                  <span class="cost__value">
                    {{ tariff.value || tariff.value2 || '' }}
                  </span>
                  <span class="cost__period">
                    {{ tariff.units || tariff.units2 || '' }}
                  </span>
                </div>
                <div v-else>
                  <span>—</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { DealAttribute, IDealItem } from '~/types/deals'

export default Vue.extend({
  computed: {
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    activeSliders (): (DealAttribute | undefined)[] {
      return [...this.compareList, ...this.compareList]
        .slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
        .map(tariff => tariff.attributes
          .find(el => el.key === 'first_month_cost'))
    },
    showShare (): boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && (el?.value || el?.value2) !== (arr[i - 1]?.value || arr[i - 1]?.value2)) ||
        (i !== 0 && (el?.units || el?.units2) !== (arr[i - 1]?.units || arr[i - 1]?.units2))
      })
    }
  }
})
</script>
<style scoped>
.cost__value {
  margin: 0 4px;
}
.slick-slide {
  width: 370px;
}
.container {
  overflow: hidden;
}
</style>
