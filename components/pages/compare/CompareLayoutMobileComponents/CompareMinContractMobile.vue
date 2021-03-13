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
            <div class="compareTable__content-cell">
              <div class="cost">
                <div v-if="activeSlidersLeft">
                  <span class="cost__value">
                    {{ activeSlidersLeft.value || activeSlidersLeft.value2 || '—' }}
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
                  <span class="cost__value">
                    {{ activeSlidersRight.value || activeSlidersRight.value2 || '—' }}
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
<style scoped>

</style>
<script lang="ts">
import Vue from 'vue'
import { DealAttribute, IDealItem } from '~/types/deals'

export default Vue.extend({
  computed: {
    activeSlidersLeft (): (DealAttribute | undefined) {
      return this.compareList[this.swipeNextLeft]?.attributes.find(el => el.key === 'contract')
    },
    activeSlidersRight (): (DealAttribute | undefined) {
      return this.compareList[this.swipeNextRight]?.attributes.find(el => el.key === 'contract')
    },
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    showMinContract (): boolean {
      return (Boolean(this.activeSlidersLeft) ||
      Boolean(this.activeSlidersRight)) &&
       (this.isComparing ? (JSON.stringify(this.activeSlidersLeft)) !==
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
  display: flex;
}
</style>
