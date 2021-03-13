<template>
  <div v-if="showAdv" class="compareTable__section">
    <div class="container compareTable__section-header">
      <div class="compareTable__section-icon">
        <img src="~/assets/images/sprite-svg/additionals.svg" alt="">
      </div>
      <div class="compareTable__section-title">
        Преимущества
      </div>
    </div>
    <div class="compareTable__content">
      <div class="container">
        <div class="compareTable__content-row">
          <div class="flex">
            <div class="compareTable__content-cell compareTable__text">
              <div>
                <ul v-for="(el, idx) in textLeft" :key="idx">
                  <div v-if="el">
                    <li> <p>{{ el ? el : '—' }}</p></li>
                  </div>
                  <div
                    v-else
                    style="
                  display: flex;
                  align-items: center;
                "
                  >
                    —
                  </div>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="compareTable__content-cell compareTable__text">
              <div>
                <ul v-for="(el, idx) in textRight" :key="idx">
                  <div v-if="el">
                    <li> <p>{{ el ? el : '—' }}</p></li>
                  </div>
                  <div
                    v-else
                    style="
                  display: flex;
                  align-items: center;
                "
                  >
                    —
                  </div>
                </ul>
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
import { IDealItem } from '~/types/deals'

export default Vue.extend({
  computed: {
    compareList (): IDealItem[] {
      return this.$vuex.compare.compareList
    },
    isComparing (): boolean {
      return this.$vuex.compare.showDifferences
    },
    activeSlidersLeft (): IDealItem {
      return this.compareList[this.swipeNextLeft]
    },
    textLeft (): string[] {
      return this.activeSlidersLeft?.benefits.map(el => el.text)
    },
    swipeNextLeft ():number {
      return this.$vuex.compare.nextSlideMobileLeft
    },
    showAdv ():boolean {
      return (this.activeSlidersLeft || this.activeSlidersRight) &&
      (this.isComparing ? this.textLeft.join('') !== this.textRight.join('') : true)
    },
    activeSlidersRight (): IDealItem {
      return this.compareList[this.swipeNextRight]
    },
    textRight (): string[] {
      return this.activeSlidersRight?.benefits.map(el => el.text)
    },
    swipeNextRight ():number {
      return this.$vuex.compare.nextSlideMobileRight
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
  width: 100%;
}
ul {
  padding: 0;
  list-style: none;
}
</style>
