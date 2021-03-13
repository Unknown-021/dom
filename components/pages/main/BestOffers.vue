<template>
  <section v-if="mainPage" class="bestOffers">
    <div class="bestOffers__caption">
      <div class="container">
        <h2>{{ $replacer(mainPage.FirstBlockTitle) }}</h2>
        <div class="bestOffers__caption-notice">
          {{ mainPage.ThirdBlockDescription }}
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="bestOffers.length" class="bestOffers__list-heading bestOffers__list-heading_white">
        Интернет
      </div><!-- Slider main container-->
      <div v-if="bestOffers.length" class="bestOffers__list">
        <VueSlickCarousel ref="sliderInternet" v-bind="slickConfig">
          <slider-card v-for="item in bestOffers" :key="item.id" :item="item" :is-blog="true" :is-one="bestOffers.length <= 1" />
        </VueSlickCarousel>
        <div
          class="swiper-button swiper-button-prev"
          @click="$refs.sliderInternet.prev()"
        >
          <img width="18" height="18" alt="arrow" src="~/assets/images/sprite-svg/arrow-left-gray.svg">
        </div>
        <div
          class="swiper-button swiper-button-next"
          @click="$refs.sliderInternet.next()"
        >
          <img
            width="18"
            height="18"
            alt="arrow"
            src="~/assets/images/sprite-svg/arrow-left-gray.svg"
            style="transform: rotate(180deg)"
          >
        </div>
      </div>
      <div v-if="bestOffersTV.length" class="bestOffers__list-heading">
        Интернет + ТВ
      </div>
      <div v-if="bestOffersTV.length" class="bestOffers__list">
        <VueSlickCarousel ref="sliderInternetTv" v-bind="slickConfig">
          <slider-card v-for="item in bestOffersTV" :key="item.id" :item="item" :is-blog="true" :is-one="bestOffersTV.length <= 1" />
        </VueSlickCarousel>
        <div
          class="swiper-button swiper-button-prev"
          @click="$refs.sliderInternetTv.prev()"
        >
          <img width="18" height="18" alt="arrow" src="~/assets/images/sprite-svg/arrow-left-gray.svg">
        </div>
        <div
          class="swiper-button swiper-button-next"
          @click="$refs.sliderInternetTv.next()"
        >
          <img
            width="18"
            height="18"
            alt="arrow"
            src="~/assets/images/sprite-svg/arrow-left-gray.svg"
            style="transform: rotate(180deg)"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { IDealItem } from '~/types/deals'

export default (Vue as VueConstructor<Vue & {
  $refs: {
    sliderInternet: typeof VueSlickCarousel;
    sliderInternetTv: typeof VueSlickCarousel;
  }
}>).extend({
  computed: {
    slickConfig (): JQuerySlickOptions {
      return {
        arrows: false,
        dots: true,
        swipeToSlide: true,
        dotsClass: 'slick-dots custom-slick-dot-class',
        infinite: true,
        centerMode: false,
        centerPadding: '20px',
        variableWidth: true
      }
    },
    mainPage: {
      get () {
        return this.$vuex.layout.mainPage
      }
    },
    bestOffers (): IDealItem[] {
      return this.$vuex.deals.bestOffers
    },
    bestOffersTV (): IDealItem[] {
      return this.$vuex.deals.bestOffersTV
    }
  }
})
</script>

<style lang="scss" scoped>
.swiper-button-next {
  right: -41px;
}
.swiper-button-prev {
  left: -41px;
}
@media (max-width: 64em) {
  .bestOffers__caption {
    margin-bottom: -90px;
  }
}
</style>
