<template>
  <div v-if="showNotelList" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/info.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Примечания
      </div>
    </div>
    <div class="compareTable__content compareTable__content_pb20 compareTable__content_pt12">
      <div class="container">
        <div class="compareTable__content-row compareTable__content-row_pb4">
          <div class="flex">
            <div v-for="(item, index) in activeSliders" :key="index" class="compareTable__content-cell">
              <div
                class="compareTable__text"
                v-html="$sanitize(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { IDealItem } from '~/types/deals'

export default Vue.extend({
  computed: {
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
    },
    activeSliders (): string[] {
      return [...this.compareList, ...this.compareList]
        .slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
        .map(el => el.content ?? '<span>—</span>')
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    showNotelList (): boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 || (i !== 0 && el !== arr[i - 1])
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
