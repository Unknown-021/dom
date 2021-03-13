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
            <div class="compareTable__content-cell">
              <div
                class="compareTable__text"
                v-html="$sanitize(activeSlidersLeft)"
              />
            </div>
          </div>
          <div class="flex">
            <div class="compareTable__content-cell">
              <div
                class="compareTable__text"
                v-html="$sanitize(activeSlidersRight)"
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
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    activeSlidersLeft (): string {
      return this.compareList[this.swipeNextLeft]?.content ?? '<span>—</span>'
    },
    activeSlidersRight (): string {
      return this.compareList[this.swipeNextRight]?.content ?? '<span>—</span>'
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    showNotelList (): boolean {
      return (Boolean(this.activeSlidersLeft) || Boolean(this.activeSlidersRight)) &&
       (this.isComparing
         ? (JSON.stringify(this.activeSlidersLeft)) !==
       (JSON.stringify(this.activeSlidersRight)) : true)
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
  width: 50%;
}
.compareTable__text{
  word-break: break-word;
}
</style>
