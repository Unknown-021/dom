<template>
  <section class="partnersNews">
    <div class="container">
      <div class="partnersNews__caption">
        <h2 :class="isProvider ? 'provider-main-title' : ''">
          Новости партнеров
        </h2>
      </div>
      <div class="partnersNews__list">
        <div v-if="isDesktop" id="partnersNewsSlider" class="swiper-container">
          <div v-if="isDesktop" class="swiper-wrapper">
            <nuxt-link
              v-for="item in blogPartnersNews"
              :key="item.id"
              class="swiper-slide"
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
                    <div class="link__icon">
                      <div class="svg-image-arrow-right svg-image-arrow-right-dims" />
                    </div>
                    <div class="link__text">
                      {{ item.shortText }}
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <blog-partners-news-mobile v-if="!isDesktop" />
      </div>
      <div class="partnersNews__list-more">
        <d-dot-link
          v-if="blogPartnersNewsExist"
          accent="accent"
          :append-icon="icons.arrow_down"
          @click="loadMore"
        >
          Загрузить еще
        </d-dot-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import { arrow_down } from '~/assets/js/icons'
import { IArticle } from '~/types/blog'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  props: {
    isProvider: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  data: () => ({
    icons: { arrow_down }
  }),
  computed: {
    blogPartnersNews (): IArticle[] {
      return this.$vuex.blog.blogPartnersNews
    },
    blogPartnersNewsExist (): boolean {
      return this.$vuex.blog.blogPartnersNewsExist
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  methods: {
    loadMore () {
      this.$vuex.blog.GetBlogPartnersNews()
    },
    day (item: string) {
      return dayjs(item).format('DD MMMM')
    },
    provider (id: number): IProvider | undefined {
      return this.$vuex.providers.byId(id)
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep {
    .partnersNews__item {
      height: 100%;
    }
  }
  .svg-image-date-dims {
    background-image: url("~assets/images/sprite-svg/date.svg");
    width: 16px;
    height: 16px;
  }
  .provider-main-title {
    color: #000;
    text-align: center;
    margin: 30px 0 20px 0;
    font-weight: 700;
  }
  .link__text {
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-style: dashed;
  }
</style>
