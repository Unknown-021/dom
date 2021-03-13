<template>
  <div v-if="compareList.length" class="comparePage">
    <div class="crumbs">
      <div class="container">
        <ul class="crumbsList">
          <li>
            <nuxt-link :to="toDeals()" class="link">
              <div class="link__icon">
                <div class="svg-image-arrow-left svg-image-arrow-left-dims" />
              </div>
              <div class="link__text">
                Назад к тарифам
              </div>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="headerInfo headerInfo_compare">
      <div class="container">
        <div class="headerInfo-compare">
          <div class="headerInfo-compare-caption">
            Сравнение тарифов
          </div>
          <label class="headerInfo-compare-toggler">
            Показывать только различия
            <d-switch v-model="isComparing" />
          </label>
          <div class="headerInfo-compare-list">
            <div v-if="compareList.length > 3" class="tariff-cards">
              <VueSlickCarousel
                :key="compareList.length"
                ref="carouselNews"
                v-bind="slickConfig"
                @beforeChange="beforeChange"
              >
                <div v-for="tariff in compareList" :key="tariff.id" class="full-slider">
                  <div class="tariff-card">
                    <img
                      class="delete"
                      src="~/assets/images/sprite-svg/close.svg"
                      alt=""
                      @click="deleteTariff(tariff)"
                    >
                    <div v-if="tariff.provider" class="tariff-card-main">
                      <img
                        v-if="
                          getProviderInfo(tariff.provider) &&
                            getProviderInfo(tariff.provider).ProviderLogo
                        "
                        :src="
                          $cmsImg(
                            getProviderInfo(tariff.provider).ProviderLogo.url
                          )
                        "
                        alt=""
                      >
                      <div class="tariff-info">
                        <div class="provider-name">
                          {{ getProviderInfo(tariff.provider).Name }}
                        </div>
                        <div class="tariff-name">
                          {{ tariff.name }}
                        </div>
                      </div>
                    </div>
                    <div class="tariff-card-connect">
                      <div class="price">
                        <div>
                          <s v-if="tariff.price_norm">{{ tariff.price_norm }}</s><span class="price-count">{{ tariff.price }}</span>
                        </div>
                        <div class="cost__period">
                          руб<span>мес</span>
                        </div>
                      </div>
                      <div class="connection-btn">
                        <d-btn primary :to="tariffPage(tariff.id)">
                          Подключить
                        </d-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </VueSlickCarousel>
              <button
                v-if="isDesktop"
                class="provider__equipment-arrows provider__equipment-arrows--prev"
                @click="prevSlide"
              >
                <span class="visually-hidden">Предыдущий слайд</span>
              </button>
              <button
                v-if="isDesktop"
                class="provider__equipment-arrows provider__equipment-arrows--next"
                @click="nextSlide"
              >
                <span class="visually-hidden">Следующий слайд</span>
              </button>
            </div>
            <div v-else class="tariff-cards-small">
              <div v-for="tariff in compareList" :key="tariff.id" class="small-slider">
                <div class="tariff-card">
                  <img
                    class="delete"
                    src="~/assets/images/sprite-svg/close.svg"
                    alt=""
                    @click="deleteTariff(tariff)"
                  >
                  <div v-if="tariff.provider" class="tariff-card-main">
                    <img
                      v-if="
                        getProviderInfo(tariff.provider) &&
                          getProviderInfo(tariff.provider).ProviderLogo
                      "
                      :src="
                        $cmsImg(
                          getProviderInfo(tariff.provider).ProviderLogo.url
                        )
                      "
                      style="max-width: 65px"
                      alt=""
                    >
                    <div class="tariff-info">
                      <div class="provider-name">
                        {{ getProviderInfo(tariff.provider).Name }}
                      </div>
                      <div class="tariff-name">
                        {{ tariff.name }}
                      </div>
                    </div>
                  </div>
                  <div class="tariff-card-connect">
                    <div class="price">
                      <div>
                        <s v-if="tariff.price_norm">{{ tariff.price_norm }}</s><span class="price-count">{{ tariff.price }}</span>
                      </div>
                      <div class="cost__period">
                        руб<span>мес</span>
                      </div>
                    </div>
                    <div class="connection-btn">
                      <d-btn primary :to="tariffPage(tariff.id)">
                        Подключить
                      </d-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="compareTable">
      <compare-advantages />
      <compare-internet />
      <compare-tv />
      <compare-mobile />
      <compare-clever-home />
      <compare-notes />
      <compare-shares />
      <compare-cost />
      <compare-min-contract />
      <compare-additionally />
      <div class="compareTable__section">
        <div class="container compareTable__section-header">
          <div class="compareTable__section-icon">
            <img
              src="~/assets/images/sprite-svg/to-compare-accent.svg"
              alt="accent-compare"
            >
          </div>
          <div class="compareTable__section-title">
            <div
              class="compareTable__content-row compareTable__content-row_flex-center compareTable__clear"
            >
              <b
                class="text-gray compareTable__text"
              >{{ compareList.length }}
                {{
                  $plural.n(compareList.length, "тариф", "тарифа", "тарифов")
                }}
                {{ $plural.n(compareList.length, "добавлен", "добавлено") }} к
                сравнению</b>
              <a class="link link_dotted link_accent">
                <div class="link__icon">
                  <div
                    class="svg-image-arrow-right svg-image-arrow-right-dims"
                  />
                </div>
                <div class="link__text link__text_bold" @click="clearCompare">
                  Очистить список
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import { Location } from 'vue-router'
import { IDealItem } from '~/types/deals'
import { IProvider } from '~/types/providers'

export default (Vue as VueConstructor<
    Vue & {
      $refs: {
        carouselNews: typeof VueSlickCarousel;
      };
    }
  >).extend({
  props: {
    compareList: {
      type: Array as PropType<IDealItem[]>,
      required: true
    }
  },
  computed: {
    swipeNext ():number {
      return this.$vuex.compare.nextSlide
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
        variableWidth: false,
        slidesToShow: 3,
        autoplay: false
      }
    },
    isComparing: {
      get (): boolean {
        return this.$vuex.compare.showDifferences
      },
      set (val: boolean) {
        this.$vuex.compare.ChangeShowDifferences(val)
      }
    }
  },
  watch: {
    swipeNext (newValue) {
       this.$refs.carouselNews?.goTo(newValue)
    }
  },
  created () {
    this.$vuex.compare.$subscribe('RemoveCompareItem', () => this.applyNewSlide())
  },
  beforeDestroy () {
    this.$vuex.compare.$subscribe('RemoveCompareItem', () => this.applyNewSlide())
  },
  methods: {
    applyNewSlide () {
      this.$refs.carouselNews?.goTo(0)
      this.$vuex.compare.NextSlide(0)
    },
    beforeChange (_currentSlide: number, nextSlide: number) {
      this.$vuex.compare.NextSlide(nextSlide)
    },
    nextSlide (): void {
      if (this.$vuex.compare.compareList.length <= 3) {
        return
      }
      this.$refs.carouselNews.next()
    },
    prevSlide (): void {
      if (this.$vuex.compare.compareList.length <= 3) {
        return
      }
      this.$refs.carouselNews.prev()
    },
    getProviderInfo (id: IDealItem['id']): IProvider {
      return this.$vuex.providers.byId(id)!
    },
    deleteTariff (item: IDealItem) {
      this.$vuex.compare.SwitchItemCompare(item)
    },
    clearCompare () {
      this.$vuex.compare.ClearCompare()
    },
    tariffPage (id: IDealItem['id']): Location {
      return {
        name: 'tariff-id',
        params: {
          id: String(id),
          city: this.$vuex.location.userCity.citySlug || '',
          street: this.$vuex.location.userStreet.streetSlug,
          house: this.$vuex.location.userHouse.houseSlug
        }
      }
    },
    toDeals (): Location {
      return {
        name: 'tariffs',
        params: {
          city: this.$vuex.location.userCity.citySlug || '',
          street: this.$vuex.location.userStreet.streetSlug,
          house: this.$vuex.location.userHouse.houseSlug || ''
        },
        query: this.$vuex.filters.filtersQueryParams
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .comparePage::v-deep {
    .custom-slick-dot-class {
      margin: 10px 0;
    }
    .compareTable__content-row {
      padding: 0;
      display: block;
    }
    .slick-slide {
      @include mq($from: desktop) {
        width: 320px;
      }
      @include mq($from: wide) {
        width: 400px;
      }

      & > div {
        max-width: 420px;
        width: 100%;
        padding: 8px;
      }
    }
    .container {
      overflow: hidden;
    }
  }
  .custom-slick-dot-class {
    margin-bottom: 10px;
  }
  .headerInfo .container {
    overflow: visible;
  }
  .tariff {
    &-cards {
      &-small {
        display: flex;
        .small-slider {
        margin: 0 45px 0 0;
      }
      }
      .full-slider {
        display: flex !important;
      }

      /* display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 24px; */
    }
    &-card {
      /*     margin: 0 8px;
   */
      background-color: #fff;
      border-radius: 4px;
      position: relative;
      display: flex !important;
      flex-direction: column;
      min-height: 169px;
      justify-content: space-between;
      width: 100%;
      @include mq($from: wide) {
        max-width: 420px;
      }
      .delete {
        position: absolute;
        top: 9px;
        right: 9px;
        cursor: pointer;
      }
      &-main {
        display: flex;
        padding: 15px;
        .tariff-info {
          margin-left: 12px;
          .provider-name {
            color: #808080;
          }
          .tariff-name {
            font-size: 20px;
            font-weight: 600;
          }
        }
      }
      &-connect {
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding: 8px;
        box-shadow: 0px 1px 24px rgba(0, 0, 0, 0.05);
        .price {
          display: flex;
          align-items: center;
          .price-count {
            font-size: 48px;
            font-weight: 600;
          }
          .cost-period {
            font-size: 20px;
          }
        }
        .connection-btn {
          margin-left: 8px;
          margin-right: 0px;
          align-self: center;
        }
      }
    }
  }
  .headerInfo_compare {
    position: sticky;
    top: 0;
    z-index: 9999999;
    background: #fff;
  }
  .compareTable {
    margin-top: 15px;
  }
  .provider__equipment-arrows--next {
    right: -32px;
  }
  .provider__equipment-arrows--prev {
    left: -24px;
  }
  .btn {
    padding-left: 20px;
    padding-right: 20px;
    @include mq($from: wide) {
      padding-left: 40px;
      padding-right: 40px;
    }
  }
</style>
