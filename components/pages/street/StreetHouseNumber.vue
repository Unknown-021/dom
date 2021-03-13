<template>
  <section v-if="streetPage" class="street__house-number">
    <div class="container">
      <transition name="fade">
        <offers-loading-modal v-if="showLoadingModal">
          <providers-loader-slider />
        </offers-loading-modal>
      </transition>
      <h1>{{ $replacer(streetPage.FirstBlock.Title) }}</h1>
      <div class="street__house-number-description" v-html="$sanitize($replacer(streetPage.FirstBlock.Description))" />
      <div class="street__select-number">
        <form class="street__form-number">
          <d-select
            v-model="house"
            filter
            no-icon
            :items="housesList"
            label="Введите номер дома"
            item-name="number"
            item-value="slug"
          />
          <d-btn primary @click="setHouse(house)">
            Найти тарифы
          </d-btn>
        </form>
        <street-houses-list @number="clickNumber" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { IStreetPageComponent, HouseListItem } from '~/types/layout'

export default Vue.extend({
  data: () => ({
    house: { slug: '', number: '' },
    showLoadingModal: false
  }),
  computed: {
    streetPage (): IStreetPageComponent|null {
      return this.$vuex.layout.streetPage
    },
    housesList (): HouseListItem[] {
      return Object.values(this.$vuex.layout.housesList || {}).flat()
    }
  },
  methods: {
    clickNumber ({ slug, number, fias_id, house_id }: {fias_id:string, house_id: string, slug: string, number: string}) {
      this.setHouse({
        slug,
        number,
        fias_id,
        house_id
      })
    },
    async setHouse ({ slug, number, fias_id, house_id }: {fias_id:string, house_id: string, slug: string, number: string}) {
      this.showLoadingModal = true
      this.$vuex.location.SET_HOUSE({
        houseNumber: number,
        house_type: '',
        house_id,
        houseFias_id: fias_id,
        houseSlug: slug
      })
      try {
        await this.$nextTick()
        await Promise.all([
          this.$vuex.deals.GetDeals(),
          new Promise(resolve => setTimeout(resolve, 2500))
        ])
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 300))
        this.$router.push({
          name: 'deals',
          params: {
            city: this.$vuex.location.userCity.citySlug || '',
            street: this.$vuex.location.userStreet.streetSlug,
            house: this.$vuex.location.userHouse.houseSlug || ''
          },
          query: this.$vuex.filters.filtersQueryParams
        })
      } finally {
        this.showLoadingModal = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.street__select-number  {
  align-items: flex-start;
}
</style>
