<template>
  <section class="provider__info" :style="{background: provider.MainColor}">
    <div class="container">
      <div>
        <div class="provider__info-top">
          <div class="provider__info-top-left">
            <div class="provider__info-logo">
              <img :src="$cmsImg(provider.ProviderLogo ? provider.ProviderLogo.url : '')" alt="logo">
            </div>
          </div>
          <div class="provider__info-rating">
            <div class="provider__info-rating-title">
              Рейтинг
            </div>
            <div>
              <span>{{ provider.raiting || 0 }}</span>
              <ul class="provider__info-rating-list">
                <li class="star" :style="{ '--raiting': `${provider.raiting ? provider.raiting : '0'}` }" />
              </ul>
            </div>
          </div>
          <div class="provider__info-connection">
            <span>Подключение</span>
            <a :href="'tel:' + $cmsPhone(provider.phoneNumber)">{{ provider.phoneNumber }}</a>
            <span>Бесплатный звонок по РФ</span>
          </div>
          <div class="provider__info-btn-wrap">
            <button class="provider__info-btn-phone" /><button class="provider__info-btn-menu" />
          </div>
        </div>
        <div>
          <template v-if="!showLoadingModal">
            <div
              v-if="providerCheckStatus === tariffCheckTypes.UNCHECKED || callToAdressSearch"
              id="providerCheckForm"
              class="tariffProvider__checkForm"
            >
              <ValidationObserver v-slot="{ handleSubmit }" slim="slim">
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
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules="required"
                        name="город"
                      >
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
                        />
                      </ValidationProvider>
                    </div>
                    <div class="promo__form-row promo__form-row_street">
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules="required"
                        name="улица"
                      >
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
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules=""
                        name="квартира"
                        slim="slim"
                      >
                        <d-text-input
                          v-model="stateFlat.flat"
                          :disabled="!stateHouse.houseFias_id"
                          label="Квартира"
                          :error="errors.length > 0"
                          @keydown.native.enter="handleSubmit(searchTariff)"
                        />
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
            <div
              v-if="providerCheckStatus === tariffCheckTypes.AVALILABLE && !callToAdressSearch"
              class="tariffProvider__availability"
            >
              <img src="~/assets/images/sprite-svg/pin-gray.svg">
              &nbsp; Доступен для подключения по адресу &nbsp;
              <d-dot-link accent @click="callToAdressSearch = true">
                {{ $vuex.location.userFullAddress }}
              </d-dot-link>
            </div>
            <div
              v-if="providerCheckStatus === tariffCheckTypes.OTHER_AVALIABLE && !callToAdressSearch"
              class=""
            >
              <div class="tariffProvider__checkUnsuccess-container">
                <div class="tariffProvider__checkUnsuccess-address">
                  <div class="tariffProvider__checkUnsuccess-address-icon">
                    <img src="~/assets/images/sprite-svg/pin-gray.svg">
                  </div>
                  <div class="tariffProvider__checkUnsuccess-address-text">
                    {{ provider ? provider.Name : 'Провайдер' }} недоступен по вашему адресу
                    <d-dot-link v-if="$vuex.location.userFullAddress" accent @click="callToAdressSearch = true">
                      {{ $vuex.location.userFullAddress }}
                    </d-dot-link>
                  </div>
                </div>
                <div class="tariffProvider__checkUnsuccess-other">
                  <b>Зато в вашем доме есть другие провайдеры</b>
                </div>
                <d-btn secondary :to="providerRoute">
                  Доступные провайдеры
                </d-btn>
              </div>
            </div>
            <div
              v-if="providerCheckStatus === tariffCheckTypes.NOT_AVALIABLE && !callToAdressSearch"
              class=""
            >
              <div class="tariffProvider__checkUnsuccess-container">
                <div class="tariffProvider__checkUnsuccess-address">
                  <div class="tariffProvider__checkUnsuccess-address-icon">
                    <img src="~/assets/images/sprite-svg/pin-gray.svg">
                  </div>
                  <div
                    v-if="provider"
                    class="tariffProvider__checkUnsuccess-address-text"
                  >
                    {{ provider.Name }} недоступен по вашему адресу
                    <d-dot-link v-if="$vuex.location.userFullAddress" accent @click="callToAdressSearch = true">
                      {{ $vuex.location.userFullAddress }}
                    </d-dot-link>
                  </div>
                </div>
                <div class="tariffProvider__checkUnsuccess-other">
                  <b>Автоматическая проверка адреса не удалась</b>
                  <span>Вы можете оставить завку на подключение только если уверены что дом подключен</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="showLoadingModal">
            <div
              v-if="providerCheckStatus !== tariffCheckTypes.AVALILABLE"
              id="providerChecking"
              class="tariffProvider__checking"
            >
              <div class="tariffProvider__checking-icon">
                <img
                  class="loader-img"
                  src="~/assets/images/checking.svg"
                  alt="loader"
                >
              </div>
            </div>
            <div
              v-if="providerCheckStatus === tariffCheckTypes.AVALILABLE"
              id="providerSuccess"
              class="tariffProvider__checkSuccess"
            >
              <div class="tariffProvider__checkSuccess-icon">
                <div class="svg-image-success svg-image-success-dims" />
              </div>
              <div class="tariffProvider__checkSuccess-text">
                Подключение доступно в вашем доме!
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Location } from 'vue-router'
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
      type: String,
      default: () => 0
    }
  },
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    availabileAddress (): boolean {
      return this.$vuex.location.isAddressFiled
    },
    tariffCheckTypes (): typeof TARIFF_CHECKED_ADDRESS {
      return TARIFF_CHECKED_ADDRESS
    },
    providerCheckStatus (): TARIFF_CHECKED_ADDRESS {
      return this.$vuex.providerData.providersAddressAvailale(+this.id)
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
        await this.$vuex.providerData.CheckProviderAvailable(this.id)
        try {
          await this.$router.push({
            name: 'providers-id',
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

<style lang="scss" scoped>
.tariffProvider__availability {
  margin-top: 0;
}
.tariffProvider__checkForm {
  padding: 0;
}
.tariffProvider__checkSuccess {
  background-color: #fff;
}
.provider__info-top {
   position: relative;
    z-index: 999;
}
.tariffProvider__checkForm-header  {
  padding: 20px 25px 0;
}
.promo__form {
  padding-top: 10px;
  position: relative;
    z-index: 99;
    background-color: #fff;
 &-content {
   box-shadow: none;
 }
}
</style>
