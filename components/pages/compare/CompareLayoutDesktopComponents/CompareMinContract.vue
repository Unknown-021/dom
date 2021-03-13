<template>
  <div v-if="showMinContract" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/date-accent.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Минимальный контракт
      </div>
    </div>
    <div class="compareTable__content compareTable__content_pb8 compareTable__content_pt8">
      <div class="container">
        <div class="compareTable__content-row compareTable__content-row_pt6 compareTable__content-row_pb8 compareTable__content-row_flex-center">
          <div class="flex">
            <div v-for="(tariff, index) in activeSliders" :key="index" class="compareTable__content-cell">
              <div class="cost">
                <div v-if="tariff">
                  <span class="cost__value">
                    {{ tariff.value || tariff.value2 || '—' }}
                  </span>
                  <span class="cost__period">
                    {{ tariff.units || tariff.units2 || '' }}
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
<style scoped>

</style>
<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { CompareSlickConfig } from './SlickConfig'
import { DealAttribute, IDealItem } from '~/types/deals'

export default (Vue as VueConstructor<Vue & {
  $refs: {
    carouselTerms: typeof VueSlickCarousel
  }
}>).extend({
  computed: {
    activeSliders (): (DealAttribute | undefined)[] {
      return [...this.compareList, ...this.compareList]
        .slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
        .map(tariff => tariff.attributes.find(el => el.key === 'contract'))
    },
    slickConfig (): JQuerySlickOptions {
      return CompareSlickConfig()
    },
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    showMinContract (): boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 || (i !== 0 && (el?.value || el?.value2) !== (arr[i - 1]?.value || arr[i - 1]?.value2))
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.slick-slide {
  width: 370px;
}
.container {
  overflow: hidden;
}
.flex {
  display: flex;
}
</style>
