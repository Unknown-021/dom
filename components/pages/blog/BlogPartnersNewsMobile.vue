<template>
  <div>
    <VueSlickCarousel ref="carouselNews" v-bind="slickConfig">
      <nuxt-link
        v-for="item in blogPartnersNews"
        :key="item.slug"
        class="article-wrapper"
        :to="$regionLink({ name: 'blog-id', params: { id: item.slug } })"
      >
        <div class="partnersNews__item">
          <div class="partnersNews__item-header">
            <div class="partnersNews__item-logo">
              <img
                :src="
                  $cmsImg(
                    item.provider.FilterAndTariffHeaderLogo
                      ? item.provider.FilterAndTariffHeaderLogo.url
                      : ''
                  )
                "
                alt=""
              >
            </div>
          </div>
          <div class="partnersNews__item-content">
            <div class="partnersNews__item-date">
              <div class="svg-image-date svg-image-date-dims" />
              {{ day(item.published_at) }}
            </div>
            <div class="partnersNews__item-link">
              <a class="link link_dotted link_accent" href="#">
                <div class="link__icon">
                  <div
                    class="svg-image-arrow-right svg-image-arrow-right-dims"
                  />
                </div>
                <div class="link__text">{{ item.shortText }}</div>
              </a>
            </div>
          </div>
        </div>
      </nuxt-link>
    </VueSlickCarousel>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import { IArticle } from '~/types/blog'
import { arrow_down } from '~/assets/js/icons'

export default Vue.extend({
  data: () => ({
    icons: { arrow_down }
  }),

  computed: {
    blogPartnersNews (): IArticle[] {
      return this.$vuex.blog.blogPartnersNews
    },
    blogPopularPreviewsExist (): boolean {
      return this.$vuex.blog.blogPopularPreviewsExist
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    slickConfig (): JQuerySlickOptions {
      return {
        arrows: false,
        dots: true,
        dotsClass: 'slick-dots custom-slick-dot-class',
        infinite: true,
        centerMode: false,
        centerPadding: '40px',
        slidesToScroll: 1,
        variableWidth: true
      }
    }
  },
  methods: {
    loadMore () {
      this.$vuex.blog.GetPopularPosts()
    },
    formatedText (text: string): string {
      return this.$sanitize(text ?? '')
    },
    day (item: string) {
      return dayjs(item).format('DD MMMM')
    }
  }
})
</script>

<style lang="scss" scoped>
  .article {
    background-color: #fff;
    color: #000;
    min-width: 300px;
    min-height: 280px;
    &-wrapper {
      padding: 0 10px;
    }
    &-main {
      padding: 18px 10px;
    }
    &-previewImg {
      padding: 0 2px 2px 2px;
    }
  }
  .options {
    margin-bottom: 10px;
    margin-top: 5px;
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
    .article-wrapper {
      height: 100%;
      }
    .partnersNews__item {
      height: 100%;
    }
  }
</style>
