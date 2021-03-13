<template>
  <div class="header__holder">
    <header class="header">
      <div class="fade" :class="[menuOpenned && 'js-active']" @click="menuOpenned = false" />
      <div class="container header__container">
        <nuxt-link class="logo" :to="$regionLink({ name: 'index' })">
          ДомИнтернет
        </nuxt-link>
        <div class="header__menu" :class="[menuOpenned && 'js-active']">
          <div class="header__menu-close" @click="menuOpenned = false">
            <img src="~/assets/images/sprite-svg/close.svg" alt="close">
          </div>
          <div class="header__menu-city">
            <div class="header__menu-item location-button">
              <d-dot-link @click="$vuex.layout.cityChooser = true">
                <template v-slot:prependIcon>
                  <img src="~/assets/images/sprite-svg/pin.svg" alt="point">
                </template>{{ selectedCityName }}
              </d-dot-link>
              <city-detected-tooltip />
            </div>
          </div>
          <div class="header__menu-list">
            <div class="header__menu-item">
              <nuxt-link class="header__menu-link" :to="$regionLink({ name: 'tariffs' })" @click.native="menuOpenned = false">
                Тарифы
              </nuxt-link>
            </div>
            <div class="header__menu-item">
              <nuxt-link class="header__menu-link" :to="$regionLink({ name: 'blog' })" @click.native="menuOpenned = false">
                Блог
              </nuxt-link>
            </div>
          </div>
          <div class="header__menu-phone">
            <a v-if="mainPage" class="header__menu-phone-number" :href="'tel:' + $cmsPhone(mainPage.MainNumber)">{{ mainPage.MainNumber }}</a>
            <div class="header__menu-phone-feedback">
              <d-dot-link @click="$vuex.layout.callBack = true">
                <template v-slot:prependIcon="{ hover }">
                  <img v-if="!hover" alt="arrow" src="~/assets/images/sprite-svg/arrow-right-hover.svg">
                  <img v-else alt="arrow" src="~/assets/images/sprite-svg/arrow-right-red.svg">
                </template>Обратный звонок
              </d-dot-link>
            </div>
          </div>
        </div>
        <a class="header__enter" href="#"><img alt="enter" src="~/assets/images/sprite-svg/enter.svg">
          <div class="header__enter-text">Войти</div>
        </a>
        <div v-if="mainPage" class="header__phone">
          <a class="header__phone-link" :href="'tel:' + $cmsPhone(mainPage.MainNumber)">{{ mainPage.MainNumber }}<img alt="phone" src="~/assets/images/sprite-svg/phone.svg"></a>
        </div>
        <div class="header__burger" @click="menuOpenned = true">
          <span /><span /><span />
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      menuOpenned: false
    }
  },
  computed: {
    selectedCityName (): string {
      return this.$vuex.location.selectedCity.shortname + ' ' + this.$vuex.location.selectedCity.name || 'Не определен'
    },
    mainPage: {
      get () {
        return this.$vuex.layout.mainPage
      }
    }
  }
})
</script>

<style lang="scss">
  .location-button {
    position: relative;
    a {
      margin-left: 40px;
    }
  }
  .header__menu-list {
    a {
      position: relative;
      &.active {
        &::after {
          content: "";
          height: 2px;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: -9px;
          background: $primaryBlue;
        }
      }
    }
  }
</style>
