<template>
  <div>
    <VueSlickCarousel ref="carouselNews" v-bind="slickConfig">
      <nuxt-link
        v-for="article in mostPopularList"
        :key="article.slug"
        class="article-wrapper"
        :to="$regionLink({ name: 'blog-id', params: { id: article.slug } })"
      >
        <div class="article">
          <div class="article-main">
            <div class="">
              <template v-if="article.timeToRead">
                <img
                  class="time_to_read"
                  src="~/assets/images/sprite-svg/time-gray.svg"
                >
                {{ article.timeToRead }}
              </template>
            </div>
            <div class="mostPopular__item-title">
              {{ article.Title }}
            </div>
            <div class="" v-html="formatedText(article.shortText) || ''" />
          </div>
          <div class="article-previewImg">
            <img
              :src="$cmsImg(article.previewImg ? article.previewImg.url : '')"
              alt=""
            >
          </div>
        </div>
      </nuxt-link>
    </VueSlickCarousel>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { IArticle } from '~/types/blog'
import { arrow_down } from '~/assets/js/icons'

export default Vue.extend({
  data: () => ({
    icons: { arrow_down }
  }),

  computed: {
    mostPopularList (): IArticle[] {
      return this.$vuex.blog.blogPopularPreviews
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
  .article{
    max-width: 320px;
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

    .article {
      height: 100%;
      &-wrapper {
      height: 100%;
    }
    }
  }
</style>
