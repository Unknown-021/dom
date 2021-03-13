<template>
  <div v-if="showAdditionally" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/etc.svg" alt="">
        <div class="svg-image-etc svg-image-etc-dims" />
      </div>
      <div class="compareTable__section-title">
        Дополнительно
      </div>
    </div>
    <div class="compareTable__content compareTable__content_pb8 compareTable__content_pt8">
      <div class="container">
        <div class="compareTable__content-row compareTable__content-row_flex-center">
          <div class="flex">
            <div class="compareTable__content-cell">
              <div class="cost">
                <div v-if="activeSlidersLeft">
                  <span class="cost__period">
                    {{ activeSlidersLeft.name || activeSlidersLeft.name || '' }}
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
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="compareTable__content-cell">
              <div class="cost">
                <div v-if="activeSlidersRight">
                  <span class="cost__period">
                    {{ activeSlidersRight.name || activeSlidersRight.name || '' }}
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
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    activeSlidersLeft (): (DealAttribute|undefined) {
      return this.compareList[this.swipeNextLeft]?.attributes.find(el => el.key === 'promo_period')
    },
    activeSlidersRight (): (DealAttribute|undefined) {
      return this.compareList[this.swipeNextRight]?.attributes.find(el => el.key === 'promo_period')
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    showAdditionally (): boolean {
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
}
</style>
