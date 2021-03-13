<template>
  <section class="provider__news">
    <div class="provider__news-body">
      <h2>Новости</h2>
      <div v-if="providerNewsList.length" class="provider__news-list">
        <VueSlickCarousel ref="carouselNews" v-bind="slickConfig">
          <div v-for="item in providerNewsList" :key="item.id" class="div">
            <div class="blogList">
              <div id="newBlogs" class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <nuxt-link class="blogListItem item" :to="$regionLink({ name: 'blog-id', params: { id: item.slug } })">
                      <div class="provider__news-item-img">
                        <img :src="$cmsImg(item.previewImg ? item.previewImg.url : '')" :alt="item.Title">
                      </div>
                      <div class="provider__news-item-text-block">
                        <h3>{{ item.Title }}</h3>
                        <div class="provider__news-item-description">
                          <span>{{ item.shortText }}</span>
                        </div>
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VueSlickCarousel>
        <button
          class="provider__equipment-arrows provider__equipment-arrows--prev"
          @click="showPrev"
        >
          <span class="visually-hidden">Предыдущий слайд</span>
        </button>
        <button
          class="provider__equipment-arrows provider__equipment-arrows--next"
          @click="showNext"
        >
          <span class="visually-hidden">Следующий слайд</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { IArticle } from '~/types/blog'
import { IProvider } from '~/types/providers'

export default (Vue as VueConstructor<
    Vue & {
      $refs: {
        carouselNews: typeof VueSlickCarousel;
      };
    }
  >).extend({
  props: {
    id: {
      type: String,
      default: () => 0
    }
  },
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
    providerNewsList (): IArticle[] {
      return this.provider.posts
    },
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    }
  },
  methods: {
    showNext () {
      this.$refs.carouselNews.next()
    },
    showPrev () {
      this.$refs.carouselNews.prev()
    }
  }
})
</script>

<style lang="scss" scoped>
  .swiper-wrapper {
    padding: 0;

    h3 {
    font-size: 22px;
    font-weight: bold;
    line-height: 24px;
    margin-bottom: 8px;
    }
  }
</style>
