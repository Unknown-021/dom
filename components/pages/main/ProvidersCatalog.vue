<template>
  <section class="providersCatalog">
    <div class="container">
      <div class="providersCatalog__caption">
        <h2>Провайдеры в <br> {{ providerLocationName }}</h2>
      </div>
      <transition-group tag="div" name="fade" class="providersCatalog__list">
        <div v-for="provider in viewLocationProvidersAlways" :key="provider.id" class="providersCatalog__item">
          <div class="providersCatalog__item-logo">
            <img
              :src="$cmsImg(provider.FilterAndTariffHeaderLogo ? provider.FilterAndTariffHeaderLogo.url : '')"
              :alt="provider.Name"
            >
          </div>
          <div class="providersCatalog__item-link">
            <nuxt-link :to="getProviderRoute(provider.SourceID)" class="link">
              <div class="link__icon">
                <div class="svg-image-arrow-right-gray svg-image-arrow-right-gray-dims" />
              </div>
              <div class="link__text">
                {{ $plural.v(provider.tariffCount, '%d тариф', '%d тарифа', '%d тарифов') }}
              </div>
            </nuxt-link>
          </div>
        </div>
      </transition-group>
      <div v-if="numberShoweProviders < locationProviders.length && locationProviders.length !== numberShoweProviders" class="providersCatalog__list-more">
        <d-dot-link accent @click.prevent="numberShoweProviders = locationProviders.length">
          <template v-slot:prependIcon="{ hover }">
            <img v-if="!hover" alt="arrow" src="~/assets/images/sprite-svg/arrow-right.svg">
            <img v-else alt="arrow" src="~/assets/images/sprite-svg/arrow-right-hover.svg">
          </template>Показать еще {{ $plural.v(locationProviders.length - numberShoweProviders, '%d провайдер', '%d провайдера', '%d провайдеров') }}
        </d-dot-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  data: () => ({
    numberShoweProviders: 6
  }),
  computed: {
    locationProviders (): (IProvider & {tariffCount: number})[] {
      const providersTariff = Object.entries(this.$vuex.deals.locationProviders ?? {})
        .sort((a, b) => b[1] - a[1])
        .map(val => [Number(val[0]), val[1]])

      const providers = providersTariff.map((val) => {
        const element = this.$vuex.providers.byId(val[0])!
        return Object.assign({}, element, {
          tariffCount: val[1]
        })
      })

      return providers
    },
    viewLocationProvidersAlways (): (IProvider & {tariffCount: number})[] {
      return this.locationProviders.slice(0, this.numberShoweProviders)
    },
    providerLocationName () : String {
      return this.$vuex.location.selectedCity.name_l || this.$vuex.location.selectedCity.shortname + '. ' + this.$vuex.location.selectedCity.name
    }
  },
  methods: {
    getProviderRoute (provider: IProvider['SourceID']): Location {
      return {
        name: 'tariffs',
        params: { city: this.$route.params.city },
        query: {
          provider: [String(provider)]
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .providersCatalog__item-logo {
    img {
      max-height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
</style>
