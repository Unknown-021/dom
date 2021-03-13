<template>
  <div class="slides">
    <div class="slider-container" :style="{padding: isDesktop ? '70px' : '0'}">
      <VueSlickCarousel ref="carouselNews" v-bind="slickConfig">
        <slider-card v-for="item in tariffs" :key="item.id" :item="item" :is-blog="true" :is-one="tariffs.length <= 1" />
      </VueSlickCarousel>
      <button v-if="isDesktop" class="provider__equipment-arrows provider__equipment-arrows--prev" @click="prevSlide">
        <span class="visually-hidden">Предыдущий слайд</span>
      </button>
      <button v-if="isDesktop" class="provider__equipment-arrows provider__equipment-arrows--next" @click="nextSlide">
        <span class="visually-hidden">Следующий слайд</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { IDealItem } from '~/types/deals'

export default (Vue as VueConstructor<Vue & {
  $refs: {
    carouselNews: typeof VueSlickCarousel
  }
}>).extend({
  props: {
    tariffs: {
      type: Array as PropType<IDealItem[]>,
      default: () => []
    }
  },
  computed: {
    slickConfig (): JQuerySlickOptions {
      return this.tariffs.length > 1
        ? {
          arrows: false,
          dots: true,
          dotsClass: 'slick-dots custom-slick-dot-class',
          infinite: true,
          centerMode: false,
          centerPadding: '40px',
          variableWidth: true
        } : {
          dots: true,
          fade: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        }
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  methods: {
    nextSlide () {
      this.$refs.carouselNews?.next()
    },
    prevSlide () {
      this.$refs.carouselNews?.prev()
    }
  }

})
</script>

<style lang="scss" scoped>
  .slides {
    background-color: #f7f7f7;
    .slider-container {
      position: relative;
    }

  }
</style>
