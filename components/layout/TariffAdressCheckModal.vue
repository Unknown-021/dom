<template>
  <d-design-modal v-model="$vuex.layout.adressCheckModal">
    <template>
      <div
        v-if="tariffCheckStatus === tariffCheckTypes.UNCHECKED || callToAdressSearch"
        id="providerCheckForm"
        class="tariffProvider__checkForm"
      >
      <ValidationObserver v-slot="{ handleSubmit }" slim="slim">
        <div class="adress-check">
          <span class="adress-check--title">Доступность для подключения по адресу</span>
          <span @click="$vuex.layout.adressCheckModal = true" class="adress-check--check">Проверить</span>
        </div>
      <div class="promo__form">
        <div class="tariffProvider__checkForm-header">
          <div class="tariffProvider__checkForm-caption">
            Проверьте возможность подключения тарифа
          </div>
          <div class="tariffProvider__checkForm-label">
            Введите ваш адрес
          </div>
          <div class="tariffProvider__checkForm-clean">
            <a
              class="link link_dotted link_accent"
              href="#"
              @click="clearFormState"
            >
              <div class="link__text">Очистить</div>
            </a>
          </div>
        </div>
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
            <d-btn
              primary="primary"
              :disabled="!stateHouse.houseFias_id"
              submit="submit"
              @click="handleSubmit(searchTariff)"
            >
              Проверить
            </d-btn>
          </div>
        </div>
      </div>
      </ValidationObserver>
      </div>
    </template>
  </d-design-modal>
</template>

<script lang='ts'>
import { Location } from 'vue-router'
import { PropType } from 'vue'
import { SearchFullAddressMixin } from '~/mixins/SearchFullAddressMixin'
import { emptyLocation } from '~/subscribes/location'
import { LocationItem } from '~/types/dadata'
import { ICity, IHouse, IStreet } from '~/types/location'
import { TARIFF_CHECKED_ADDRESS } from '~/types/tariff'
import { IProvider } from '~/types/providers'

export default SearchFullAddressMixin.extend({
  data: () => ({
    showLoadingModal: false,
    searchCity: '',
    searchStreet: '',
    searchHouse: '',
    searchLoaders: {
      city: false,
      street: false,
      house: false
    },
    searchItems: {
      city: [] as ICity[],
      street: [] as LocationItem<IStreet>[],
      house: [] as LocationItem<IHouse>[]
    },
    callToAdressSearch: false
  }),
  props: {
    id: {
      type: Number,
      required: true
    },
    provider: {
      type: Object as PropType<IProvider | undefined>
    }
  },
  computed: {
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    availabileAddress (): boolean {
      return this.$vuex.location.isAddressFiled
    },
    tariffCheckTypes (): typeof TARIFF_CHECKED_ADDRESS {
      return TARIFF_CHECKED_ADDRESS
    },
    tariffCheckStatus (): TARIFF_CHECKED_ADDRESS {
      /* return TARIFF_CHECKED_ADDRESS.NOT_AVALIABLE */
      return this.$vuex.tariff.tariffAddressAvailale(+this.$route.params.id)
    },
    providerRoute (): Location {
      return {
        name: 'deals',
        params: {
          city: this.stateCity.citySlug,
          street: this.stateStreet.streetSlug,
          house: this.stateHouse.houseSlug || ''
        }
      }
    }
  },
  created () {
    const city = this.$vuex.location.selectedCity
    const street = this.$vuex.location.userStreet
    const house = this.$vuex.location.userHouse
    if (city) {
      this.searchItems.city.push(city)
    }
    if (street.street) {
      this.searchItems.street.push({
        id: street.street,
        name: street.street_with_type || street.street,
        type: street.street_type,
        data: { ...street }
      })
    }
    if (house.house) {
      this.searchItems.house.push({
        id: house.house,
        name: house.house,
        type: house.house,
        data: { ...house }
      })
    }
  },
  methods: {
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
    },
    clearFormState () {
      this.stateStreet = { ...emptyLocation }
    },
    cityFullname (cityFullname: string[]|string = ['']) {
      if (Array.isArray(cityFullname)) {
        return cityFullname[0] ?? ''
      }
      return cityFullname.split(',')[0]
    },
    async searchTariff () {
      this.showLoadingModal = true
      try {
        await this.$vuex.location.SetCityByFilter({ slug: this.stateCity.citySlug })
        await this.$vuex.location.SetFullAddressFromSuggestion(this.combineLocations(
          this.stateStreet,
          this.stateHouse,
          this.stateFlat
        ))
        await this.$nextTick()
        await this.$vuex.tariff.CheckTariffAvailable(this.id)
        try {
          await this.$router.push({
            name: 'tariff-id',
            params: {
              city: this.stateCity.citySlug,
              street: this.stateStreet.streetSlug,
              house: this.stateHouse.houseSlug || undefined,
              id: this.$route.params.id
            }
          })
        } catch (e) {
          //
        }

        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (e) {
        // TODO
      } finally {
        this.callToAdressSearch = false
        this.showLoadingModal = false
      }
    }
  }
})
</script>
