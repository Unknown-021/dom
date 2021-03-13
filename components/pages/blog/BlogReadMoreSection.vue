<template>
  <div v-if="posts.length" class="blogItem__container">
    <div class="blogItem__content">
      <div class="blogItem__content-block">
        <div class="blogItem__articles-block">
          <h2 class="title">
            Читать еще
          </h2>
          <div v-if="!isDesktop" class="newBlogs__content">
            <div class="newBlogs__content">
              <div v-if="posts" class="newBlogs__content-wrapper">
                <VueSlickCarousel ref="carousel" v-bind="slickConfig">
                  <div
                    v-for="item in posts"
                    :key="item.id"
                    class="div auto-height"
                  >
                    <div class="blogList">
                      <div id="newBlogs" class="swiper-container">
                        <div class="swiper-wrapper">
                          <div class="swiper-slide">
                            <div class="blogListItem item">
                              <div class="blogListItem__image">
                                <div class="blogListItem__time">
                                  <div class="blogListItem__time-icon">
                                    <div
                                      class="svg-image-time svg-image-time-dims"
                                    />
                                  </div>
                                  {{ item.timeToRead ? item.timeToRead : "" }}
                                </div>
                                <img
                                  :src="
                                    $cmsImg(
                                      item.previewImg ? item.previewImg.url : ''
                                    )
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
              </div>
            </div>
          </div>
          <div v-else style="display: flex">
            <div v-for="item in posts" :key="item.id" class="blogListItem item">
              <div class="blogListItem__image">
                <div class="blogListItem__time">
                  <div class="blogListItem__time-icon">
                    <img src="~/assets/images/clock.svg">
                  </div>
                  <div v-if="item.timeToRead" class="time">
                    {{ item.timeToRead ? item.timeToRead : '' }} мин
                  </div>
                </div>
                <img :src="$cmsImg(item.Image ? item.Image.url : '')" alt="">
              </div>
              <br>
              <div class="blogListItem__content" />
              <div class="blogListItem__link">
                <nuxt-link
                  accent
                  :to="
                    $regionLink({
                      name: 'blog-id',
                      params: { id: item.slug }
                    })
                  "
                  class="link"
                >
                  <template v-slot:prependIcon>
                    <img src="~/assets/images/sprite-svg/arrow-right.svg">
                  </template>
                  <div class="blogListItem__title">
                    {{ item.Title }}
                  </div>
                </nuxt-link>
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
import { IArticle } from '~/types/blog'

export default Vue.extend({
  data: () => ({
    articles: [] as IArticle[]
  }),

  computed: {
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
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
    posts (): IArticle[] {
      return [...this.$vuex.blog.newPosts].slice(0, 3)
    }
  }
})
</script>

<style lang="scss" scoped>
  .blogList .swiper-slide {
    width: 260px;
    margin: 0;
  }
  @media (max-width: 1024px) {
    .blogItem__articles-block {
      padding: 24px 15px;
    }
  }
  .newBlogs__content-wrapper {
    position: relative;
    & > div {
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
  .blogListItem{
    box-shadow: unset;
  }
  .blogListItem__link {
    padding: 0 16px 14px;
  }
  .auto-height {
    position: relative;
    height: 100%;
  }

  .blogListItem__title {
    color: black;
    font-size: 18px;
  }
  .blogListItem__time-icon {
    padding-top: 4px;
  }
  ::v-deep {
    .slick-slide {
      & > div {
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
