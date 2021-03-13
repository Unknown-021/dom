<template>
  <div class="container" :style="{ padding: !isDesktop ? '0' : ''}">
    <div class="mostPopular__caption">
      <h2 :style="{ paddingLeft: !isDesktop ? '10px' : '0'}">
        Самое популярное
      </h2>
    </div>
    <div v-if="isDesktop" class="popular-main-desktop">
      <div class="mostPopular__list">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              v-for="article in mostPopularList"
              :key="article.slug"
              class="swiper-slide"
            >
              <nuxt-link
                class="mostPopular__item"
                :to="
                  $regionLink({ name: 'blog-id', params: { id: article.slug } })
                "
              >
                <div class="mostPopular__item-content">
                  <div class="mostPopular__item-time">
                    <template v-if="article.timeToRead">
                      <img
                        class="time_to_read"
                        src="~/assets/images/sprite-svg/time-gray.svg"
                      >{{ article.timeToRead }}
                    </template>
                  </div>
                  <div class="mostPopular__item-title">
                    {{ article.Title }}
                  </div>
                  <div
                    class="mostPopular__item-intro"
                    v-html="formatedText(article.shortText) || ''"
                  />
                </div>
                <div class="mostPopular__item-image">
                  <img
                    :src="
                      $cmsImg(article.previewImg ? article.previewImg.url : '')
                    "
                    alt=""
                  >
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="swiper-pagination" />
        </div>
      </div>
      <div class="mostPopular__list-more">
        <d-dot-link
          v-if="blogPopularPreviewsExist"
          accent="accent"
          :append-icon="icons.arrow_down"
          @click="loadMore"
        >
          Загрузить еще
        </d-dot-link>
      </div>
    </div>
    <blog-popular-mobile v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// eslint-disable-next-line camelcase
import { arrow_down } from '~/assets/js/icons'
import { IArticle } from '~/types/blog'

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
  .mostPopular__item-title:before {
    content: url("~assets/images/sprite-svg/arrow-right.svg");
    display: inline-block;
    position: absolute;
    padding: 0;
    opacity: 0;
    left: -20px;
    top: -3px;
  }
  .mostPopular__list-more::after {
    content: url("~assets/images/sprite-svg/arrow-down.svg");
    display: inline-block;
    position: absolute;
    padding: 0;
    top: 5px;
  }
  .mostPopular__caption {
    margin-top: 54px;
    margin-bottom: 10px;
  }
  .container {
    margin-bottom: 30px;

    .time_to_read {
      margin-right: 7px;
    }
  }
</style>
