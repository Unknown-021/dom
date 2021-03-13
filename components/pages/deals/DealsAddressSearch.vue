<template>
  <div class="offers__searchAddress" :style="{ marginBottom: changeAddress ? '65px' : '38px' }">
    <div class="offers__searchAddress-container" :style="{height: changeAddress && isDesktop ? '110px' : 'auto'}">
      <transition mode="out-in" tag="div" name="fade">
        <div
          v-if="!changeAddress"
          key="text"
          class="offers__searchAddress-wrapper"
        >
          <div class="offers__searchAddress-text">
            <template v-if="$route.name === 'deals'">
              Предложения по адресу<br><b>{{ $vuex.location.userFullAddress }}</b>
            </template>
            <template v-else>
              Предложения в <br><b>
                {{ $vuex.location.selectedCity.shortname }}.
                {{ $vuex.location.selectedCity.name_l || $vuex.location.selectedCity.name }}
              </b>
            </template>
          </div>
          <div class="offers__searchAddress-button">
            <a class="link link_dotted link_accent" @click="changeAddress = true">
              <div class="link__icon">
                <img src="~/assets/images/sprite-svg/arrow-right-white.svg">
              </div>
              <div class="link__text">Изменить</div>
            </a>
          </div>
        </div>
        <div
          v-else
          key="input"
          class="offers__searchAddress-input-wrapper"
          :style="{justifyContent: changeAddress ? 'flex-start':'center'}"
        >
          <div class="text">
            <div class="offers__searchAddress-input-text">
              <span>Изменение адреса</span>
              <a :style="{position: isDesktop ? 'absolute' : 'relative'}" @click="changeAddress = false">
                <div class="link__icon">
                  <img src="~/assets/images/sprite-svg/arrow-right-white.svg">
                </div>
                <span>Отменить</span>
              </a>
            </div>
          </div>
          <ValidationObserver
            v-slot="{ handleSubmit }"
            tag="div"
            class="orderConnect"
            :style="{ position: changeAddress && isDesktop ? 'absolute' : 'relative', top: isDesktop ? '60px' : '0', width: '80%'
            }"
          >
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
                  <d-btn :style="isDesktop ? '' : 'margin: 0'" primary="primary" submit="submit" @click="handleSubmit(searchTariff)">
                    Найти тарифы
                  </d-btn>
                </div>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { SearchFullAddressMixin } from '~/mixins/SearchFullAddressMixin'

export default SearchFullAddressMixin.extend({
  data: () => ({
    changeAddress: false
  }),
  computed: {
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    }
  },
  methods: {
    async searchTariff () {
      try {
        if (this.stateCity.citySlug !== this.$vuex.location.userCity.citySlug) {
          await this.$vuex.location.SetCityByFilter({ slug: this.stateCity.citySlug })
        }
        await this.$vuex.location.SetFullAddressFromSuggestion(this.combineLocations(
          this.stateCity,
          this.stateStreet,
          this.stateHouse,
          this.stateFlat
        ))
        try {
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
        } catch (error) {
          //
        }
      } catch (e) {
        //
      } finally {
        this.changeAddress = false
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
  .offers__searchAddress {
    position: relative;
  }
  .offers__searchAddress-input {
    &-wrapper {
      display: flex;
      justify-content: center;
      flex-grow: 1;
      align-items: center;
      flex-direction: column;

      .text {
        width: 100%;
      }
      a {
        display: block;
        padding: 20px;
        cursor: pointer;
        margin: 0 10px;
      }
      .orderConnect {
        padding: 0;
      }
    }
    &-text {
      align-items: center;
      display: flex;
      position: relative;
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      span {
        color: #fff;
        font-size: 24px;
        font-weight: 600;
      }
      a {
        position: absolute;
        right: 0;
        display: flex;
        span {
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          border-bottom: 1px dashed white;
        }
        .link__icon {
          margin-right: 7px;
        }
      }
    }
  }
</style>
