<template>
  <div class="offers__content">
    <div class="offers__searchAddress-results">
      {{ searchResultTitle }}
    </div>
    <d-dropdown
      v-model="sort"
      :items="sortTypes"
      class="offers__sorter"
    />
    <div class="offers__container container">
      <div v-if="searchResultTitle == '' " class="offers__container-no-result">
        <span class="offers__no-result-title">
          По вашим параметрам не удалось найти тарифы
        </span>
        <br>
        <span class="offers__no-result-subtitle">
          Попробуйте ослабить фильтры
        </span>
      </div>
      <template v-for="(item, index) in $vuex.deals.deals">
        <deal-card
          :key="item.id"
          :is-desktop="isDesktop"
          :item="item"
        />
        <template v-if="(index + 1) % 10 === 0 && index !== 0">
          <div :key="index + '-banner'">
            <deal-card-call />
          </div>
        </template>
      </template>

      <div v-if="!$vuex.deals.loadedAll && !!$vuex.deals.deals.length " class="offers__loadMore">
        <div v-intersection="{ cb: loadMoreItems }" class="offers__loadMore__intersector" />
        <d-btn
          :loading="$vuex.deals.loadingMore"
          @click="$vuex.deals.GetNextDeals($route.name === 'tariffs')"
        >
          Загрузить еще
        </d-btn>
      </div>
    </div>
    <transition name="fade">
      <div v-if="$vuex.compare.count" class="offers__controls_desktop">
        <nuxt-link
          to="/compare"
          tag="button"
          class="btn btn-compare"
        >
          <img src="~/assets/images/sprite-svg/compare-white.svg">
          &nbsp;
          {{ `Сравнить ${$plural.v($vuex.compare.count, '%d тариф', '%d тарифа', '%d тарифов')}` }}
        </nuxt-link>
      </div>
    </transition>
    <d-modal
      v-if="!isDesktop"
      :value="!!$vuex.layout.mobileDeal"
      z-index="90"
    >
      <deal-card-mobile-detail :item="$vuex.layout.mobileDeal" />
    </d-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash/debounce'
import { DEALS_SORT_TYPES } from '~/types/deals'

export default Vue.extend({
  data () {
    return {
      loadMoreItems: debounce(() => {
        if (!this.$vuex.deals.loading) {
          this.$vuex.deals.GetNextDeals(this.$route.name === 'tariffs')
        }
      })
    }
  },
  computed: {
    sort: {
      get (): DEALS_SORT_TYPES {
        return this.$vuex.filters.sort
      },
      set (val: DEALS_SORT_TYPES) {
        this.$vuex.filters.SET_SORT(val)
      }
    },
    sortTypes (): {id: DEALS_SORT_TYPES, name: string}[] {
      return [
        {
          id: DEALS_SORT_TYPES.COST_CHEAP,
          name: 'Сначала дешевле'
        },
        {
          id: DEALS_SORT_TYPES.SPEED_FAST,
          name: 'Сначала самые быстрые'
        }
      ]
    },
    mountIntersector (): any {
      return !this.$vuex.deals.loadedAll &&
        !!this.$vuex.deals.deals.length &&
        !this.$vuex.deals.loading &&
        !this.$vuex.deals.loadingMore
    },
    searchResultTitle (): string {
      if (!this.$vuex.deals.dealsCount || !this.$vuex.deals.providersCount) {
        return ''
      }
      return [
        'Найдено',
        this.$plural.n(this.$vuex.deals.dealsCount, '%d тариф', '%d тарифа', '%d тарифов'),
        'от',
        this.$plural.n(this.$vuex.deals.providersCount, '%d провайдера', '%d провайдеров')
      ].join(' ')
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  }
})
</script>

<style lang="scss" scoped>
  .offers__loadMore {
    position: relative;
    text-align: center;
    padding-bottom: 40px;
    margin-top: 20px;

    &__intersector {
      position: absolute;
      top: -140vh;
      bottom: -100%;
      height: 1px;
      pointer-events: none;
    }
  }
  .offers__container-no-result{
    padding-top: 45px;
  }
  .offers__no-result-title{
    font-size: 1.4rem;
    margin-bottom: 15px;
  }
  .offers__no-result-subtitle{
    font-size: 1.1rem;
    position: relative;
    top: 5px;
  }
</style>
