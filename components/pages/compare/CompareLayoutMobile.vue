<template>
  <div class="comparePage" :class=" compareList.length === 1 ? 'hideSecond' : ''">
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
          <div class="headerInfo-compare-list headerInfo-compare-list_mobile">
            <div v-if="compareList.length > 1" class="slider-wrapper">
              <div :style="{width: compareList.length === 1 ? '100%' : '50%' }" class="slider-left">
                <VueSlickCarousel
                  :key="compareList.length"
                  ref="carouselNews"
                  v-bind="slickConfig"
                  @beforeChange="beforeChangeLeft"
                >
                  <div v-for="tariff in compareList" :key="tariff.id" class="headerInfo-compare-slider">
                    <div class="swiper-container">
                      <div class="swiper-wrapper">
                        <div class="swiper-slide">
                          <div class="headerInfo-compare-item">
                            <img class="delete" src="~/assets/images/sprite-svg/close.svg" alt="" @click="deleteTariff(tariff)">
                            <div class="headerInfo-compare-close">
                              <div class="svg-image-close svg-image-close-dims" />
                            </div>
                            <div v-if="tariff.provider" class="headerInfo-compare-header">
                              <div class="headerInfo-compare-thumb">
                                <img
                                  v-if="getProviderInfo(tariff.provider) && getProviderInfo(tariff.provider).ProviderLogo"
                                  :src="$cmsImg(getProviderInfo(tariff.provider).ProviderLogo.url)"
                                  alt=""
                                >
                              </div>

                              <div class="headerInfo-compare-provider">
                                {{ getProviderInfo(tariff.provider).Name }}
                              </div>
                              <div class="headerInfo-compare-title">
                                {{ tariff.name }}
                              </div>
                            </div>
                            <div class="headerInfo-compare-footer">
                              <div class="cost">
                                <div class="cost__value">
                                  {{ tariff.price }}
                                </div>
                                <div class="cost__period">
                                  руб<span>мес</span>
                                </div>
                              </div><d-btn secondary :to="tariffPage(tariff.id)">
                                Подключить
                              </d-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                    <!-- <div class="swiper-pagination__holder">
                  <div class="swiper-pagination" />
                  <div class="swiper-pagination-pager">
                    <div class="swiper-pagination-current">
                      1
                    </div><span>из</span>
                    <div class="swiper-pagination-from">
                      5
                    </div>
                  </div>
                </div> -->
                    </div>
                  </div>
                </VueSlickCarousel>
              </div>
              <div class="slider-right">
                <VueSlickCarousel
                  :key="compareList.length"
                  ref="carouselNewsRight"
                  v-bind="slickConfig"
                  @beforeChange="beforeChangeRight"
                >
                  <div v-for="tariff in compareList" :key="tariff.id" class="headerInfo-compare-slider">
                    <div class="swiper-container">
                      <div class="swiper-wrapper">
                        <div class="swiper-slide">
                          <div class="headerInfo-compare-item">
                            <img class="delete" src="~/assets/images/sprite-svg/close.svg" alt="" @click="deleteTariff(tariff)">
                            <div class="headerInfo-compare-close">
                              <div class="svg-image-close svg-image-close-dims" />
                            </div>
                            <div v-if="tariff.provider" class="headerInfo-compare-header">
                              <div class="headerInfo-compare-thumb">
                                <img
                                  v-if="getProviderInfo(tariff.provider) && getProviderInfo(tariff.provider).ProviderLogo"
                                  :src="$cmsImg(getProviderInfo(tariff.provider).ProviderLogo.url)"
                                  alt=""
                                >
                              </div>

                              <div class="headerInfo-compare-provider">
                                {{ getProviderInfo(tariff.provider).Name }}
                              </div>
                              <div class="headerInfo-compare-title">
                                {{ tariff.name }}
                              </div>
                            </div>
                            <div class="headerInfo-compare-footer">
                              <div class="cost">
                                <div class="cost__value">
                                  {{ tariff.price }}
                                </div>
                                <div class="cost__period">
                                  руб<span>мес</span>
                                </div>
                              </div><d-btn secondary :to="tariffPage(tariff.id)">
                                Подключить
                              </d-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                    <!-- <div class="swiper-pagination__holder">
                  <div class="swiper-pagination" />
                  <div class="swiper-pagination-pager">
                    <div class="swiper-pagination-current">
                      1
                    </div><span>из</span>
                    <div class="swiper-pagination-from">
                      5
                    </div>
                  </div>
                </div> -->
                    </div>
                  </div>
                </VueSlickCarousel>
              </div>
            </div>
            <div v-if="compareList.length && compareList.length === 1" style="width: 100%" class="headerInfo-compare-item">
              <img class="delete" src="~/assets/images/sprite-svg/close.svg" alt="" @click="deleteTariff(compareList[0])">
              <div class="headerInfo-compare-close">
                <div class="svg-image-close svg-image-close-dims" />
              </div>
              <div v-if="compareList[0].provider" class="headerInfo-compare-header">
                <div class="headerInfo-compare-thumb">
                  <img
                    v-if="getProviderInfo(compareList[0].provider) && getProviderInfo(compareList[0].provider).ProviderLogo"
                    :src="$cmsImg(getProviderInfo(compareList[0].provider).ProviderLogo.url)"
                    alt=""
                  >
                </div>

                <div class="headerInfo-compare-provider">
                  {{ getProviderInfo(compareList[0].provider).Name }}
                </div>
                <div class="headerInfo-compare-title">
                  {{ compareList[0].name }}
                </div>
              </div>
              <div class="headerInfo-compare-footer">
                <div class="cost">
                  <div class="cost__value">
                    {{ compareList[0].price }}
                  </div>
                  <div class="cost__period">
                    руб<span>мес</span>
                  </div>
                </div><d-btn secondary :to="tariffPage(compareList[0].id)">
                  Подключить
                </d-btn>
              </div>
            </div>
            <!--  <div class="headerInfo-compare-slider">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="headerInfo-compare-item">
                      <div class="headerInfo-compare-close">
                        <div class="svg-image-close svg-image-close-dims" />
                      </div>
                      <div class="headerInfo-compare-header">
                        <div class="headerInfo-compare-thumb">
                          <img :src="require('~/assets/images/tmp/img-06.png')" alt="">
                        </div>
                        <div class="headerInfo-compare-provider">
                          Ростелеком
                        </div>
                        <div class="headerInfo-compare-title">
                          Игровой MAX
                        </div>
                      </div>
                      <div class="headerInfo-compare-footer">
                        <div class="cost">
                          <div class="cost__value">
                            1200
                          </div>
                          <div class="cost__period">
                            руб<span>мес</span>
                          </div>
                        </div><a class="btn btn-secondary" href="#">Подключить</a>
                      </div>
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="headerInfo-compare-item">
                      <div class="headerInfo-compare-close">
                        <div class="svg-image-close svg-image-close-dims" />
                      </div>
                      <div class="headerInfo-compare-header">
                        <div class="headerInfo-compare-thumb">
                          <img :src="require('~/assets/images/tmp/img-05.jpg')" alt="">
                        </div>
                        <div class="headerInfo-compare-provider">
                          Дом.ru
                        </div>
                        <div class="headerInfo-compare-title">
                          Фантастический МАХ
                        </div>
                      </div>
                      <div class="headerInfo-compare-footer">
                        <div class="cost">
                          <div class="cost__value">
                            1200
                          </div>
                          <div class="cost__period">
                            руб<span>мес</span>
                          </div>
                        </div><a class="btn btn-secondary" href="#">Подключить</a>
                      </div>
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="headerInfo-compare-item">
                      <div class="headerInfo-compare-close">
                        <div class="svg-image-close svg-image-close-dims" />
                      </div>
                      <div class="headerInfo-compare-header">
                        <div class="headerInfo-compare-thumb">
                          <img :src="require('~/assets/images/tmp/img-05.jpg')" alt="">
                        </div>
                        <div class="headerInfo-compare-provider">
                          Дом.ru
                        </div>
                        <div class="headerInfo-compare-title">
                          Фантастический МАХ
                        </div>
                      </div>
                      <div class="headerInfo-compare-footer">
                        <div class="cost">
                          <div class="cost__value">
                            1200
                          </div>
                          <div class="cost__period">
                            руб<span>мес</span>
                          </div>
                        </div><a class="btn btn-secondary" href="#">Подключить</a>
                      </div>
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="headerInfo-compare-item">
                      <div class="headerInfo-compare-close">
                        <div class="svg-image-close svg-image-close-dims" />
                      </div>
                      <div class="headerInfo-compare-header">
                        <div class="headerInfo-compare-thumb">
                          <img :src="require('~/assets/images/tmp/img-05.jpg')" alt="">
                        </div>
                        <div class="headerInfo-compare-provider">
                          Дом.ru
                        </div>
                        <div class="headerInfo-compare-title">
                          Фантастический МАХ
                        </div>
                      </div>
                      <div class="headerInfo-compare-footer">
                        <div class="cost">
                          <div class="cost__value">
                            1200
                          </div>
                          <div class="cost__period">
                            руб<span>мес</span>
                          </div>
                        </div><a class="btn btn-secondary" href="#">Подключить</a>
                      </div>
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="headerInfo-compare-item">
                      <div class="headerInfo-compare-close">
                        <div class="svg-image-close svg-image-close-dims" />
                      </div>
                      <div class="headerInfo-compare-header">
                        <div class="headerInfo-compare-thumb">
                          <img :src="require('~/assets/images/tmp/img-05.jpg')" alt="">
                        </div>
                        <div class="headerInfo-compare-provider">
                          Дом.ru
                        </div>
                        <div class="headerInfo-compare-title">
                          Фантастический МАХ
                        </div>
                      </div>
                      <div class="headerInfo-compare-footer">
                        <div class="cost">
                          <div class="cost__value">
                            1200
                          </div>
                          <div class="cost__period">
                            руб<span>мес</span>
                          </div>
                        </div><a class="btn btn-secondary" href="#">Подключить</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination__holder">
                  <div class="swiper-pagination" />
                  <div class="swiper-pagination-pager">
                    <div class="swiper-pagination-current">
                      1
                    </div><span>из</span>
                    <div class="swiper-pagination-from">
                      5
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="compareTable">
      <compare-advantages-mobile :compare-list="compareList" />
      <compare-internet-mobile :compare-list="compareList" />
      <compare-tv-mobile :compare-list="compareList" />
      <compare-mobile-mobile :compare-list="compareList" />
      <compare-clever-home-mobile :compare-list="compareList" />
      <compare-notes-mobile :compare-list="compareList" />
      <compare-shares-mobile :compare-list="compareList" />
      <compare-cost-mobile :compare-list="compareList" />
      <compare-min-contract-mobile :compare-list="compareList" />
      <compare-additionally-mobile :compare-list="compareList" />
      <div class="compareTable__section">
        <div class="container">
          <div class="compareTable__content-row compareTable__content-row_flex-center">
            <div class="compareTable__content-cell-footer">
              <b class="text-gray compareTable__text">{{ compareList.length }} {{ $plural.n(compareList.length, 'тариф','тарифа', 'тарифов') }}  {{ $plural.n(compareList.length, 'добавлен','добавлено') }} к сравнению</b><a class="link link_dotted link_accent" />
            </div>
            <div class="compareTable__content-cell-footer">
              <a class="link link_dotted link_accent" href="#">
                <div class="link__icon">
                  <div class="svg-image-arrow-right svg-image-arrow-right-dims" />
                </div>
                <div class="link__text link__text_bold" @click="clearCompare">Очистить список</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'
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
    slickConfig (): JQuerySlickOptions {
      return {
        arrows: false,
        dots: true,
        dotsClass: 'slick-dots custom-slick-dot-class',
        infinite: true,
        centerMode: false,
        centerPadding: '0px',
        variableWidth: false,
        slidesToShow: 1,
        autoplay: false,
        adaptiveHeight: true
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
  methods: {
    beforeChangeLeft (_currentSlide: number, nextSlide: number) {
      this.$vuex.compare.NextSlideMobileLeft(nextSlide)
    },
    beforeChangeRight (_currentSlide: number, nextSlide: number) {
      this.$vuex.compare.NextSlideMobileRight(nextSlide)
    },
    getProviderInfo (id: IDealItem['id']): IProvider {
      return this.$vuex.providers.byId(id)!
    },
    deleteTariff (item: IDealItem) {
      this.$vuex.compare.SwitchItemCompare(item)
      this.$vuex.compare.NextSlideMobileLeft(0)
      this.$vuex.compare.NextSlideMobileRight(0)
    },
    /*  deleteTariffRight (item: IDealItem) {
      this.$vuex.compare.SwitchItemCompare(item)
    }, */
    clearCompare () {
      this.$vuex.compare.ClearCompare()
    },
    tariffPage (id: IDealItem['id']): Location {
      return {
        name: 'tariff-id',
        params: {
          id: String(id),
          city: this.$vuex.location.userCity.citySlug || '',
          street: this.$vuex.location.userStreet.streetSlug || '',
          house: this.$vuex.location.userHouse.houseSlug || ''
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

.comparePage.hideSecond {
  &::v-deep {
    .compareTable__content-row {
      flex-flow: column;
      align-items: center;
      .flex {
        width: auto;
        justify-content: center;
      }

      .flex:last-child {
        display: none;
      }
    }
  }
}

.delete {
  position: absolute;
  top: 9px;
  right: 9px;
  cursor: pointer;
}
.compareTable__content-cell-footer {
  flex: calc(50% - 8px) 0 0;
}
.slider-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .slider-left, .slider-right {
    width: 50%;
  }
  .slider-left {
    padding-right: 3px;
  }
  .slider-right {
    padding-left: 3px;
  }
}
.comparePage::v-deep {
  .headerInfo-compare-slider {
    max-width: 100%;
  }
.slick-slide {

      & > div {
        width: 100%;
      }
    }
}
</style>
