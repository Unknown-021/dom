<template>
  <div class="compareTable__section">
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
            <div v-for="(item, index) in text" :key="index" class="compareTable__content-cell compareTable__text">
              <div v-if="item.length">
                <ul v-for="(el, idx) in item" :key="idx">
                  <div v-if="item.length">
                    <li> <p>{{ el ? el : '—' }}</p></li>
                  </div>
                </ul>
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
    activeSliders (): IDealItem[] {
      return [...this.compareList, ...this.compareList].slice(this.swipeNext, this.swipeNext + Math.min(this.compareList.length, 3))
    },
    text (): string[][] {
      return this.activeSliders.map(item => item.benefits.map(el => el.text))
    },
    showAdv ():boolean {
      return this.activeSliders.some(Boolean) && this.activeSliders.some((el, i, arr) => {
        return !this.isComparing || arr.length === 1 ||
        (i !== 0 && el !== arr[i - 1])
      })
    },
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
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
ul {
  padding: 0;
}
</style>
