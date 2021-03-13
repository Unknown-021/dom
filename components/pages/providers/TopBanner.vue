<template>
  <section v-if="provider.Slider.length" class="provider__top-banner">
    <div class="container">
      <VueSlickCarousel v-bind="slickConfig">
        <div v-for="(banner, index) in provider.Slider" :key="index" class="provider__top-banner-body">
          <div class="provider__top-banner-top">
            <div class="provider__top-banner-title">
              {{ banner.Title }}
            </div>
            <div class="provider__top-banner-description" v-html="formatedText(banner.Description)" />
            <d-btn secondary @click="showModal=!showModal">
              Подробнее
            </d-btn>
          </div>
          <div class="provider__top-banner-bottom">
            <div
              class="provider__top-banner-image"
              :style="{ 'background-image': `url(${$cmsImg(banner.Images ? banner.Images.url : '')})` }"
            />
          </div>
        </div>
      </VueSlickCarousel>
    </div>

    <d-modal v-model="showModal">
      <template v-slot="{ close }">
        <div
          class="provider__top-banner-modal"
          :class="{
            'provider__top-banner-modal--view1': view === 1,
            'provider__top-banner-modal--view2': view === 2,
            'provider__top-banner-modal--view3': view === 3,
          }"
        >
          <button class="provider__top-banner-modal-close" @click="close">
            <span class="visually-hidden">Закрыть</span>
          </button>
          <template v-if="view === 1">
            <div class="provider__top-banner-modal-top">
              <div
                class="provider__top-banner-modal-image"
                :style="{ 'background-image': `url(${$cmsImg(provider.Slider[0].Images ? provider.Slider[0].Images.url : '')})` }"
              />
            </div>
            <div class="provider__top-banner-modal-bottom">
              <div class="provider__top-banner-modal-title">
                {{ provider.Slider[0].Title }}
              </div>
              <div class="provider__top-banner-modal-description">
                Оставьте заявку и менеджер свяжется для уточнения деталей и выбора времени установки
              </div>
              <form class="provider__top-banner-modal-form">
                <d-text-input label="Имя" />
                <d-text-input label="Телефон" />
                <d-btn primary>
                  Отправить
                </d-btn>
              </form>
            </div>
            <div class="provider__top-banner-modal-change-tariff">
              <d-dot-link accent :prepend-icon="icons.arrow_right" @click="view = 2">
                У меня подключен домашний интернет Билайн. Хочу сменить тариф
              </d-dot-link>
              <div class="provider__top-banner-modal-switch">
                <d-switch />
              </div>
            </div>
          </template>
          <template v-if="view === 2">
            <div class="provider__top-banner-modal-top">
              <div class="provider__top-banner-modal-top-text">
                На нашем сайте возможно только новое подключение
              </div>
            </div>
            <div class="provider__top-banner-modal-bottom">
              <div class="provider__top-banner-modal-description">
                Введите адрес и получите лучшие предложения, доступные в вашем доме
              </div>
              <form class="provider__top-banner-modal-form">
                <d-text-input label="Город" />
                <d-text-input label="Улица" />
                <div class="provider__top-banner-modal-form-wrap">
                  <d-text-input label="Дом" />
                  <d-text-input label="Квартира" />
                </div>
                <d-btn primary>
                  Смотреть тарифы
                </d-btn>
              </form>
            </div>
          </template>
          <template v-if="view === 3">
            <div class="provider__top-banner-modal-top">
              <div class="provider__top-banner-modal-top-text">
                На нашем сайте возможно только новое подключение
              </div>
            </div>
            <div class="provider__top-banner-modal-bottom">
              <div class="provider__top-banner-modal-description">
                По вашему адресу доступно 37 тарифов от 5 провайдеров
              </div>
              <d-btn primary>
                Смотреть тарифы
              </d-btn>
            </div>
          </template>
        </div>
      </template>
    </d-modal>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { arrow_right } from '~/assets/js/icons'
import { IProvider } from '~/types/providers'

export default Vue.extend({

  props: {
    id: {
      type: String,
      default: () => 0
    }
  },
  data: () => ({
    showModal: false,
    close: true,
    icons: {
      arrow_right
    },
    view: 3
  }),
  computed: {
    slickConfig (): JQuerySlickOptions {
      return {
        arrows: false,
        dots: true,
        dotsClass: 'slick-dots custom-slick-dot-class',
        accessibility: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        speed: 900,
        autoplaySpeed: 5000,
        cssEase: 'linear'
      }
    },
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    }
  },
  methods: {
    formatedText (text: string): string {
      return this.$sanitize(text || '')
    }
  }
})
</script>

<style lang="scss" scoped>
.provider__top-banner-image {
  background-size: contain;
}
</style>
