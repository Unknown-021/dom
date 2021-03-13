<template>
  <div class="speedtest__show-tariff">
    <div class="container">
      <h2>Чтобы посмотреть тарифы, введите адрес</h2>
      <ValidationObserver v-slot="{ handleSubmit }" slim="slim">
        <div class="promo__form">
          <div class="promo__form-content">
            <div class="promo__form-row">
              <ValidationProvider v-slot="{ errors }" rules="required" name="город">
                <d-select
                  v-model="stateCity"
                  filter
                  server-filter
                  no-icon
                  :items="searchItems.city"
                  label="Город"
                  return-object
                  item-value="fias_id"
                  :loading="searchLoaders.city"
                  :search-value.sync="searchCity"
                  :error="errors.length > 0"
                  @keydown.native.enter="handleSubmit(searchTariff)"
                />
              </ValidationProvider>
            </div>
            <div class="promo__form-row promo__form-row_street">
              <ValidationProvider v-slot="{ errors }" rules="required" name="улица">
                <d-select
                  v-model="stateStreet"
                  :disabled="!stateCity.citySlug"
                  filter
                  server-filter
                  no-icon
                  :items="searchItems.street"
                  label="Улица"
                  return-object
                  :loading="searchLoaders.street"
                  :search-value.sync="searchStreet"
                  :error="errors.length > 0"
                  item-value="street"
                  item-name="street"
                  @keydown.native.enter="handleSubmit(searchTariff)"
                >
                  <template v-slot:item="{ item }">
                    <span v-if="item.street">{{ item.street_type }}. {{ item.street }}</span>
                  </template>
                  <template v-slot:selected="{ item }">
                    <span v-if="item.street">{{ item.street_type }}. {{ item.street }}</span>
                  </template>
                </d-select>
              </ValidationProvider>
            </div>
            <div class="promo__form-row promo__form-row_number">
              <ValidationProvider v-slot="{ errors }" rules="required" name="дом" slim="slim">
                <d-select
                  v-model="stateHouse"
                  :disabled="!stateStreet.streetSlug"
                  filter
                  server-filter
                  no-icon
                  :items="searchItems.house"
                  label="Дом"
                  return-object
                  :loading="searchLoaders.house"
                  :search-value.sync="searchHouse"
                  :error="errors.length > 0"
                  item-value="house"
                  item-name="house"
                  @keydown.native.enter="handleSubmit(searchTariff)"
                />
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" rules="" name="квартира" slim="slim">
                <d-text-input
                  v-model="stateFlat.flat"
                  :disabled="!stateHouse.houseSlug"
                  label="Квартира"
                  :error="errors.length > 0"
                  @keydown.native.enter="handleSubmit(searchTariff)"
                />
              </ValidationProvider>
            </div>
            <div class="promo__form-row promo__form-row_button">
              <d-btn primary="primary" submit="submit" @click="handleSubmit(searchTariff)">
                Найти тарифы
              </d-btn>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <offers-loading-modal v-if="showLoadingModal">
      <providers-loader-slider />
    </offers-loading-modal>
  </div>
</template>

<script lang="ts">
import { SearchFullAddressMixin } from '~/mixins/SearchFullAddressMixin'

export default SearchFullAddressMixin.extend({
  data: () => ({
    showLoadingModal: false
  }),
  methods: {
    async searchTariff (): Promise<void> {
      try {
        this.showLoadingModal = true
        await this.$vuex.location.SetCityByFilter({ slug: this.stateCity.citySlug })
        await this.$vuex.location.SetFullAddressFromSuggestion(this.combineLocations(
          this.stateStreet,
          this.stateHouse,
          this.stateFlat
        ))
        if (this.stateHouse.houseSlug) {
          await this.$nextTick()
          await Promise.all([
            this.$vuex.deals.GetDeals(),
            new Promise(resolve => setTimeout(resolve, 2500))
          ])
          await this.$nextTick()
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        this.$router.push({
          name: this.stateHouse.houseSlug ? 'deals' : 'street',
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
