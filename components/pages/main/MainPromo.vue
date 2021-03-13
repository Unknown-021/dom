<template>
  <section class="promo">
    <ValidationObserver v-if="mainPage" v-slot="{ handleSubmit }" slim="slim">
      <div class="container">
        <transition name="fade">
          <offers-loading-modal v-if="showLoadingModal">
            <providers-loader-slider />
          </offers-loading-modal>
        </transition>
        <div class="promo__title">
          <h1>{{ $replacer(mainPage.FirstBlockTitle) }} </h1>
        </div>
        <div class="promo__notice">
          {{ mainPage.FirstBlockDescription }}
        </div>
        <div class="promo__form">
          <d-tabs v-model="typeSearch" :items="typeTabs" mandatory="mandatory" />
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
              <d-btn ref="submitButton" tabindex="3" primary="primary" submit="submit" @click="handleSubmit(searchTariff)">
                Найти тарифы
              </d-btn>
            </div>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </section>
</template>

<script lang="ts">
import { SearchFullAddressMixin } from '~/mixins/SearchFullAddressMixin'
import { IMainPageComponent } from '~/types/deals'
import { TARIFF_PACKET_TYPE } from '~/types/filters'

export default SearchFullAddressMixin.extend({
  data () {
    return {
      showLoadingModal: false
    }
  },
  computed: {
    mainPage (): IMainPageComponent|null {
      return this.$vuex.layout.mainPage
    },
    typeTabs (): any[] {
      return [
        {
          name: 'Все тарифы',
          id: TARIFF_PACKET_TYPE.ALL
        },
        {
          name: 'Интернет+ТВ',
          id: TARIFF_PACKET_TYPE.INTERNET_TV
        },
        {
          name: 'Интернет',
          id: TARIFF_PACKET_TYPE.INTERNET
        }
      ]
    },
    typeSearch: {
      get (): TARIFF_PACKET_TYPE {
        const [val] = this.$vuex.filters.filterValues.service__service_type as TARIFF_PACKET_TYPE[]
        return val
      },
      set (type: TARIFF_PACKET_TYPE) {
        this.$vuex.filters.SET_FILTER_VALUE({
          id: 'service__service_type',
          value: [type]
        })
      }
    }
  },
  methods: {
    async searchTariff (): Promise<void> {
      try {
        this.showLoadingModal = true
        await this.$vuex.location.SetCityByFilter({ slug: this.stateCity.citySlug })
        await this.$vuex.location.SetFullAddressFromSuggestion(this.combineLocations(
          this.stateCity,
          this.stateStreet,
          this.stateHouse,
          this.stateFlat
        ))
        if (this.stateHouse.houseNumber) {
          await this.$nextTick()
          await Promise.all([
            this.$vuex.deals.GetDeals(),
            new Promise(resolve => setTimeout(resolve, 2500))
          ])
          await this.$nextTick()
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        const deals = Boolean(!this.$vuex.location.userStreet.streetSlug && !this.$vuex.location.userHouse?.houseSlug)
        if (deals) {
          this.$router.push({
            name: 'tariffs',
            params: {
              city: this.$vuex.location.userCity?.citySlug || ''
            },
            query: this.$vuex.filters.filtersQueryParams
          })
        } else {
          this.$router.push({
            name: this.stateHouse.houseNumber ? 'deals' : 'street',
            params: {
              city: this.$vuex.location.userCity?.citySlug || '',
              street: this.$vuex.location.userStreet?.streetSlug || '',
              house: this.$vuex.location.userHouse?.houseSlug || ''
            },
            query: this.stateHouse.houseNumber ? this.$vuex.filters.filtersQueryParams : undefined
          })
        }
      } finally {
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
  .no-outline{
    outline: none;
    color: rgb(133, 196, 252);
  }
  ::v-deep {

  @media (max-width: 64em) {
  .promo__form-caption-indicator {
    font-size: 11px;
    padding-left: 7px;
    border: 1px solid #FFF;
  }
  }
}
</style>
