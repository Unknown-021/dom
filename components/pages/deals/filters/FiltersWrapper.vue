<template>
  <ValidationObserver
    v-slot="{ failed }"
    tag="div"
    class="filter__wrapper"
    :class="[value && 'is-active']"
    @click.self="$emit('input', false)"
  >
    <div class="filter">
      <div class="filter__caption">
        Фильтры
        <div class="filter__close" @click="$emit('input', false)">
          <img src="~/assets/images/sprite-svg/close.svg">
        </div>
        <div class="filter__scrolltop">
          <div class="svg-image-arrow-up svg-image-arrow-up-dims" />
        </div>
      </div>
      <div class="filter__content">
        <form>
          <filter-item
            v-for="item in filtersShowAlways"
            :key="item.id.toString()"
            :value="item"
          />
          <transition-expand v-if="filtersShowHidden.length" :duration="400">
            <div v-if="showHidden" class="filter__additional">
              <filter-item
                v-for="item in filtersShowHidden"
                :key="item.id"
                :value="item"
              />
            </div>
          </transition-expand>
          <d-dot-link accent @click="showHidden = !showHidden">
            {{ showHidden ? 'Свернуть настройки' : 'Дополнительные настройки' }}
          </d-dot-link>
        </form>
        <!-- <div class="filter-banner">
          <h4 class="filter-banner-title">
            Удобнее подобрать тариф по телефону? Звоните!
          </h4>
          <a :href="'tel:' + $cmsPhone(mainPageNumber || '')" class="filter-banner-phone">
            {{ mainPageNumber }}
          </a>
          <div class="filter-banner-small-text">
            Бесплатный звонок по РФ
          </div>
        </div> -->
      </div>
      <transition tag="div" name="fade">
        <div
          v-if="(showApplyFilters && !failed) || $vuex.deals.errorDeals"
          class="apply-button-wrapper"
        >
          <span
            v-if="!$vuex.filters.changed.findError"
            key="apply-text"
            class="deals-count"
            :class="[applyFiltersLoading && 'loading']"
          >
            {{ $plural.n(newDealsCount, 'Найден %d тариф', 'Найдено %d тарифа', 'Найдено %d тарифов') }}
          </span>
        </div>
      </transition>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue'
import { FilterOption } from '~/types/filters'

export default Vue.extend({
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    showHidden: false
  }),
  computed: {
    mainPageNumber (): string | undefined {
      return this.$vuex.layout.mainPage?.MainNumber
    },
    filters (): FilterOption[] {
      return Object.values(this.$vuex.filters.filterTypes)
        .filter(item => this.$vuex.filters.isFilterEnabled(item.id))
    },
    filtersShowAlways (): FilterOption[] {
      return this.filters.slice(0, this.$vuex.filters.filtersShowAlwaysCount)
    },
    filtersShowHidden (): FilterOption[] {
      return this.filters.slice(this.$vuex.filters.filtersShowAlwaysCount)
    },
    newDealsCount (): number {
      return this.$vuex.filters.changed.foundDeals
    },
    showApplyFilters (): boolean {
      return this.$vuex.filters.changed.haveChanged
    },
    applyFiltersLoading (): boolean {
      return this.$vuex.filters.changed.loadingNew
    }
  },
  watch: {
    value (val: boolean) {
      if (val) {
        document.body.classList.add('modal_open')
      } else {
        document.body.classList.remove('modal_open')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .apply-button-wrapper {
    display: flex;
    flex-flow: column;
    align-items: center;
    position: sticky;
    top: 0;
    bottom: 0;
    background: #f3f3f3db;
    text-align: center;
    z-index: 40;
    padding: 10px 0;

    .deals-count {
      font-size: 16px;
      font-weight: 500;
      color: #2e358f;
      transition: opacity .2s linear;
      opacity: 1;
      margin-bottom: 10px;

      &.loading {
        opacity: 0;
      }
    }
  }
  .filter-banner {
    margin-top: 27px;
    padding: 24px 16px;
    background-color: #fff;
    font-size: 24px;
    font-weight: 600;
    &-title {
      margin: 0;
    }
    &-phone {
      display: block;
      margin: 13px 0 8px 0;
      color: #4BA3DA;
    }
    &-small-text {
      font-weight: 400;
      font-size: 16px;
      color: #B6B6B6;
    }
  }
</style>
