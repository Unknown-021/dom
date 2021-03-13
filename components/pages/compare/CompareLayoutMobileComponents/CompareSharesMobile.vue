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
          <div class="flex">
            <div class="compareTable__content-cell">
              <div class="cost">
                <template>
                  <div v-if="activeSlidersLeft">
                    <span class="cost__period">
                      {{ activeSlidersLeft.name || activeSlidersLeft.name || '—' }}
                    </span>
                    <span class="cost__value">
                      {{ activeSlidersLeft.value || activeSlidersLeft.value2 || '' }}
                    </span>
                    <span class="cost__period">
                      {{ activeSlidersLeft.units || activeSlidersLeft.units2 || '' }}
                    </span>
                  </div>
                  <div v-else>
                    <span>—</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="compareTable__content-cell">
              <div class="cost">
                <template>
                  <div v-if="activeSlidersRight">
                    <span class="cost__period">
                      {{ activeSlidersRight.name || activeSlidersRight.name || '—' }}
                    </span>
                    <span class="cost__value">
                      {{ activeSlidersRight.value || activeSlidersRight.value2 || '' }}
                    </span>
                    <span class="cost__period">
                      {{ activeSlidersRight.units || activeSlidersRight.units2 || '' }}
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
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    activeSlidersLeft (): (DealAttribute | undefined) {
      return this.compareList[this.swipeNextLeft]?.attributes
        .find(el => el.key === 'first_month_cost')
    },
    activeSlidersRight (): (DealAttribute | undefined) {
      return this.compareList[this.swipeNextRight]?.attributes
        .find(el => el.key === 'first_month_cost')
    },
    showShare (): boolean {
      return !this.isComparing
        ? (Boolean(this.activeSlidersLeft) || Boolean(this.activeSlidersRight))
        : (this.activeSlidersLeft?.value !== this.activeSlidersRight?.value) ||
      (this.activeSlidersLeft?.value2 !== this.activeSlidersRight?.value2) ||
      (this.activeSlidersLeft?.units2 !== this.activeSlidersRight?.units2) ||
      (this.activeSlidersLeft?.units !== this.activeSlidersRight?.units)
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
.flex {
  width: 100%;
  max-width: 50%;
}
</style>
