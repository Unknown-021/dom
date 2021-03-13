<template>
  <div>
    <transition name="fade" mode="out-in">
      <section v-if="changeAddress" key="1" class="street__change-address street__change-address-with-form">
        <div>
          <div class="container">
            <button class="street__change-address-btn-return" @click="changeAddress=false">
              <img src="~/assets/images/sprite-svg/arrow-left-gray.svg" width="16" height="16" alt=""><span>Назад</span>
            </button>
            <h2 class="street__change-address-other-title">
              Выбрать другой адрес
            </h2>
          </div>
          <div class="street__change-address-form-block">
            <div class="container">
              <ValidationObserver v-slot="{ handleSubmit }" slim="slim">
                <div class="promo__form">
                  <div class="promo__form-content">
                    <div class="promo__form-row">
                      <ValidationProvider v-slot="{ errors }" rules="required" name="город">
                        <d-select
                          ref="inputCity"
                          v-model="stateCity"
                          tabindex="0"
                          filter
                          server-filter
                          no-icon
                          :items="searchItems.city"
                          label="Город"
                          return-object
                          item-name="cityName"
                          item-value="citySlug"
                          :loading="searchLoaders.city"
                          :search-value.sync="searchCity"
                          :error="errors.length > 0"
                          @focus.native="focus('Город')"
                          @keydown.native.enter="handleSubmit(searchTariff)"
                        >
                          <template #item="{ item }">
                            {{ item.cityShortname }} {{ item.cityName }}
                            <span class="full-name">{{ cityFullname(item.cityFullname || '') }}</span>
                          </template>
                          <template #selected="{ item }">
                            {{ item.cityShortname }} {{ item.cityName }}
                          </template>
                        </d-select>
                      </ValidationProvider>
                    </div>
                    <div class="promo__form-row promo__form-row_street">
                      <ValidationProvider v-slot="{ errors }" rules="required" name="улица">
                        <d-select
                          ref="inputStreet"
                          v-model="stateStreet"
                          tabindex="1"
                          :disabled="!stateCity.cityFias_id"
                          filter
                          server-filter
                          no-icon
                          :items="searchItems.street"
                          label="Улица"
                          return-object
                          :loading="searchLoaders.street"
                          :search-value.sync="searchStreet"
                          :error="errors.length > 0"
                          item-value="streetSlug"
                          item-name="streetName"
                          @focus.native="focus('Улица')"
                          @keydown.native.enter="handleSubmit(searchTariff)"
                        >
                          <template v-slot:item="{ item }">
                            <span v-if="item.streetName">{{ item.streetShortname }}. {{ item.streetName }}</span>
                          </template>
                          <template v-slot:selected="{ item }">
                            <span v-if="item.streetName">{{ item.streetShortname }}. {{ item.streetName }}</span>
                          </template>
                        </d-select>
                      </ValidationProvider>
                    </div>
                    <div class="promo__form-row promo__form-row_number">
                      <ValidationProvider v-slot="{ errors }" name="дом" slim="slim">
                        <d-select
                          ref="inputHouse"
                          v-model="stateHouse"
                          tabindex="2"
                          :disabled="!stateStreet.streetFias_id"
                          filter
                          server-filter
                          no-icon
                          :items="searchItems.house"
                          label="Дом"
                          return-object
                          :loading="searchLoaders.house"
                          :search-value.sync="searchHouse"
                          :error="errors.length > 0"
                          item-value="houseSlug"
                          item-name="houseNumber"
                          @focus.native="focus('Дом')"
                          @keydown.native.enter="handleSubmit(searchTariff)"
                        >
                          <template v-slot:item="{ item }">
                            <span v-if="item.houseNumber">{{ item.houseNumber }}</span>
                          </template>
                          <template v-slot:selected="{ item }">
                            <span v-if="item.houseNumber">{{ item.houseNumber }}</span>
                          </template>
                        </d-select>
                      </ValidationProvider>
                      <ValidationProvider v-slot="{ errors }" rules="" name="квартира" slim="slim">
                        <d-text-input v-model="stateFlat.flat" :disabled="!stateHouse.houseFias_id" label="Квартира" :error="errors.length > 0" @keydown.native.enter="handleSubmit(searchTariff)" />
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
          </div>
        </div>
      </section>
      <section
        v-if="!changeAddress"
        key="2"
        class="street__change-address"
      >
        <div class="container">
          <h2>
            {{ $replacer(pageTitle) }}
          </h2>
          <p class="street__change-address-sub-title">
            Выберите другой адрес и получите список всех доступных тарифов
          </p>
          <d-btn secondary class="street__change-address-btn-change" @click="changeAddress=true">
            Выбрать другой адрес
          </d-btn>
        </div>
      </section>
    </transition>
    <offers-loading-modal v-if="showLoadingModal">
      <providers-loader-slider />
    </offers-loading-modal>
  </div>
</template>

<script lang="ts">
import { SearchFullAddressMixin } from '~/mixins/SearchFullAddressMixin'

export default SearchFullAddressMixin.extend({
  data: () => ({
    changeAddress: false,
    showLoadingModal: false,
    pageTitle: 'Ваш дом не находится на #STREET# в #CITY_L#?'
  }),
  methods: {
    async searchTariff () {
      try {
        this.showLoadingModal = true
        await this.$nextTick()
        await this.$vuex.location.SetCityByFilter({ slug: this.stateCity.citySlug })
        await this.$vuex.location.SetFullAddressFromSuggestion(this.combineLocations(
          this.stateStreet,
          this.stateHouse,
          this.stateFlat
        ))
        await this.$nextTick()
        await Promise.all([
          this.$vuex.deals.GetDeals(),
          new Promise(resolve => setTimeout(resolve, 2500))
        ])
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 300))
        await this.$router.push({
          name: this.stateHouse.houseSlug ? 'deals' : 'street',
          params: {
            city: this.stateCity.citySlug,
            street: this.stateStreet.streetSlug,
            house: this.stateHouse.houseSlug || undefined
          },
          query: this.$vuex.filters.filtersQueryParams
        })
      } finally {
        this.changeAddress = false
        this.showLoadingModal = false
      }
    },
    cityFullname (cityFullname: string[]|string = ['']) {
      if (Array.isArray(cityFullname)) {
        return cityFullname[0] ?? ''
      }
      return cityFullname.split(',')[0]
    },
    focus (inputState: string): void {
      switch (true) {
        case inputState === 'Город':
          this.$refs.inputStreet?.$el.children[0].focus()
          break
        case inputState === 'Улица':
          this.$refs.inputHouse?.$el.children[0].focus()
          break
        case inputState === 'Дом':
          this.$refs.submitButton?.$el.focus()
          break
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.full-name {
  color: #B6B6B6
}
</style>
