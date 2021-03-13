<template>
  <section v-if="provider.devices.length" class="provider__equipment" :style="{'--background': provider.MainColor || '#fff'}">
    <div :class="[isDesktop ? 'provider__equipment-desktop' : 'provider__equipment-mobile']">
      <div class="container">
        <h2>Интернет-оборудование</h2>
        <div class="provider__equipment-list">
          <VueSlickCarousel ref="carousel" v-bind="slickConfig">
            <equipment-card
              v-for="item in provider.devices"
              :id="item.id"
              :key="item.id"
              :item="item"
              :is-desktop="isDesktop"
            />
          </VueSlickCarousel>
        </div>
        <template v-if="isDesktop">
          <button class="provider__equipment-arrows provider__equipment-arrows--prev" @click="prevSlide">
            <span class="visually-hidden">Предыдущий слайд</span>
          </button>
          <button class="provider__equipment-arrows provider__equipment-arrows--next" @click="nextSlide">
            <span class="visually-hidden">Следующий слайд</span>
          </button>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { IProvider } from '~/types/providers'

export default (Vue as VueConstructor<Vue & {
  $refs: {
    carousel: typeof VueSlickCarousel
  }
}>).extend({
  props: {
    id: {
      type: String,
      default: () => 0
    }
  },
  data: () => ({
    showModal: false
  }),
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    },

    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    slickConfig (): JQuerySlickOptions {
      return this.isDesktop
        ? {
          dots: true,
          arrows: false,
          dotsClass: 'slick-dots custom-slick-dot-class',
          adaptiveHeight: true
        } : {
          slidesToShow: 1,
          arrows: false,
          dots: true,
          dotsClass: 'slick-dots custom-slick-dot-class',
          infinite: true,
          centerMode: false,
          centerPadding: '20px',
          slidesToScroll: 1,
          variableWidth: true,
          adaptiveHeight: true
        }
    }
  },
  methods: {
    nextSlide () {
      this.$refs.carousel?.next()
    },
    prevSlide () {
      this.$refs.carousel?.prev()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
