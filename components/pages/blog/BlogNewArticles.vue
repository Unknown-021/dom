<template>
  <section class="newBlogs">
    <div class="newBlogs__header">
      <div class="newBlogs__header-image">
        <picture><img src="~/assets/images/bg-new-blog-1440.jpg" alt=""></picture>
      </div>
    </div>
    <div class="newBlogs__caption">
      <h2>Новое в блоге</h2>
    </div>
    <div v-if="posts" class="newBlogs__content">
      <VueSlickCarousel ref="carouselNews" v-bind="slickConfig">
        <div v-for="item in posts" :key="item.id" class="div">
          <div class="blogList">
            <div id="newBlogs" class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <nuxt-link class="blogListItem item" :to="$regionLink({ name: 'blog-id', params: { id: item.slug } })">
                    <div class="blogListItem__image">
                      <div class="blogListItem__time">
                        <div class="blogListItem__time-icon">
                          <div class="svg-image-time svg-image-time-dims" />
                        </div>{{ item.timeToRead ? item.timeToRead : '' }}
                      </div>
                      <img :src="$cmsImg(item.previewImg ? item.previewImg.url : '')" alt="">
                    </div>
                    <div class="blogListItem__content">
                      <div class="blogListItem__title" />
                      <div class="blogListItem__announce">
                        {{ item.Title }}
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VueSlickCarousel>
      <button v-if="isDesktop" class="provider__equipment-arrows provider__equipment-arrows--prev" @click="showPrev">
        <span class="visually-hidden">Предыдущий слайд</span>
      </button>
      <button v-if="isDesktop" class="provider__equipment-arrows provider__equipment-arrows--next" @click="showNext">
        <span class="visually-hidden">Следующий слайд</span>
      </button>
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
        carouselNews: typeof VueSlickCarousel;
      };
    }
  >).extend({
  computed: {
    posts (): IArticle[] {
      return this.$vuex.blog.newPosts
    },
    slickConfig (): JQuerySlickOptions {
      return {
        arrows: false,
        dots: true,
        dotsClass: 'slick-dots custom-slick-dot-class',
        infinite: true,
        centerMode: false,
        centerPadding: '40px',
        variableWidth: true,
        slidesToScroll: 1
      }
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  methods: {
    showNext (): void {
      this.$refs.carouselNews.next()
    },
    showPrev (): void {
      this.$refs.carouselNews.prev()
    }
  }
})
</script>

<style lang="scss" scoped>
 ::v-deep {
    .slick-slide {
      &> div {
        height: 100%;
        &> div {
          height: 100%;
        }
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
    .article-wrapper {
      height: 100%;
      }
    .partnersNews__item {
      height: 100%;
    }
  }
.item:hover {
  .blogListItem__announce {
   color: #4BA3DA;

   &::after {
     content: url('~assets/images/sprite-svg/arrow-right.svg');
     margin-left: 10px;
   }
  }
}
  .newBlogs__content {
    position: relative;
    z-index: 999;
  }
  .provider__equipment-arrows--prev {
    left:-35px;
  }
  .provider__equipment-arrows--next {
    right: -35px;
  }
</style>
