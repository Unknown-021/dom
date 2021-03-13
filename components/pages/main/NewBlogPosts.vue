<template>
  <section class="newBlogs">
    <div class="newBlogs__caption">
      <h2>Новое в блоге</h2>
    </div>
    <div class="newBlogs__content">
      <div v-if="posts && posts.length" class="newBlogs__content-wrapper">
        <VueSlickCarousel ref="carousel" v-bind="slickConfig">
          <div v-for="item in posts" :key="item.id" class="div auto-height">
            <div class="blogList">
              <div id="newBlogs" class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="blogListItem item">
                      <div class="blogListItem__image">
                        <div class="blogListItem__time">
                          <div class="blogListItem__time-icon">
                            <div class="svg-image-time svg-image-time-dims" />
                          </div>
                          {{ item.timeToRead ? item.timeToRead : "" }}
                        </div>
                        <img
                          :src="
                            $cmsImg(item.previewImg ? item.previewImg.url : '')
                          "
                          alt=""
                        >
                      </div>
                      <div class="blogListItem__content">
                        <div class="blogListItem__title">
                          <nuxt-link
                            :to="
                              $regionLink({
                                name: 'blog-id',
                                params: { id: item.slug },
                              })
                            "
                            class="link"
                          >
                            {{ item.Title }}
                          </nuxt-link>
                        </div>
                        <div class="blogListItem__announce">
                          {{ item.shortText }}
                        </div>
                      </div>
                      <div class="blogListItem__link">
                        <nuxt-link
                          accent
                          :to="
                            $regionLink({
                              name: 'blog-id',
                              params: { id: item.slug },
                            })
                          "
                          class="link link_dotted"
                          :style="{ borderBottom: `1px dashed ` }"
                        >
                          <template v-slot:prependIcon>
                            <img
                              src="~/assets/images/sprite-svg/arrow-right.svg"
                            >
                          </template>
                          <span>Подробнее</span>
                        </nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VueSlickCarousel>
        <button
          v-if="isDesktop"
          class="provider__equipment-arrows provider__equipment-arrows--prev"
          @click="showPrev"
        >
          <span class="visually-hidden">Предыдущий слайд</span>
        </button>
        <button
          v-if="isDesktop"
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

export default (Vue as VueConstructor<
    Vue & {
      $refs: {
        carousel: typeof VueSlickCarousel;
      };
    }
  >).extend({
  computed: {
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    posts (): IArticle[] {
      return this.$vuex.blog.newPosts
    },
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
    swiperOptions () {
      return {
        speed: 400,
        slidesPerView: 'auto',
        slideVisibleClass: 'swiper-slide-visible',
        watchSlidesVisibility: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '#newBlogsNext',
          prevEl: '#newBlogsPrev'
        }
      }
    }
  },
  methods: {
    showNext (): void {
      this.$refs.carousel.next()
    },
    showPrev (): void {
      this.$refs.carousel.prev()
    }
  }
})
</script>

<style lang="scss" scoped>
  .newBlogs__content-wrapper {
    position: relative;
    &> div {
      height: 100%;
    }
  }
  .provider__equipment-arrows {
    &--prev {
      left: -35px;
    }
    &--next {
      right: -35px;
    }
  }
  .blogListItem__link {
        padding: 0 16px 14px;
  }
  .auto-height {
    position: relative;
    height: 100%;
  }
  ::v-deep {
    .slick-slide {
      &> div {
        height: 100%;
      }
      .blogList {
        height: 100%;
      }
      .swiper-container {
        height: 100%;
      }
      .swiper-wrapper {
        display: flex;
        height: 100%;
      }
    }
    .slick-list {
      display: flex;
      align-items: stretch;
    }
    .slick-track {
      display: flex;
      align-items: stretch;
    }
  }
</style>
