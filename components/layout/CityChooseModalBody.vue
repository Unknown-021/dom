<template>
  <transition name="fade">
    <div v-if="!allLoading" class="modal_container">
      <div class="close_btn" @click="$emit('close')">
        <d-icon>{{ icons.close_accent }}</d-icon>
      </div>
      <div class="citySelect">
        <div class="citySelect__header">
          <div class="citySelect__title">
            Выберите ваш город
          </div>
          <div class="citySelect__search">
            <d-text-input v-model="searchString" :loading="filterLoading" label="Введите название города" />
            <div class="citySelect__search-auto">
              <template v-if="!errorDetect">
                <d-dot-link accent @click="autoDetect">
                  <template v-slot:prependIcon>
                    <img src="~/assets/images/sprite-svg/location.svg">
                  </template>
                  Определить автоматически
                </d-dot-link>
              </template>
              <template v-else>
                <span class="error">Ошибка при автоопределении города</span>
              </template>
            </div>
          </div>
        </div>
        <template v-if="!searchString && !!popularCityList.length">
          <div class="citySelect__subtitle">
            Популярные города
          </div><div class="citySelect__popular">
            <div v-for="city in popularCityList" :key="city.slug" class="citySelect__popular-item">
              <a @click="chooseHandler(city)">{{ city.name }}</a>
            </div>
          </div>
        </template>
        <div
          class="citySelect__alphabet"
        >
          <div class="citySelect__alphabet-container">
            <div v-for="(items, letter) in showData" :key="letter" class="citySelect__alphabet-item">
              <div class="citySelect__alphabet-character">
                {{ letter }}
              </div>
              <ul class="citySelect__alphabet-list">
                <li v-for="city in items" :key="city.slug">
                  <a @click="chooseHandler(city)">
                    <scope-value v-slot="{ value }" :value="getCityRegionAdd(city.fullname)">
                      <span>{{ city.name }}</span>
                      <div v-if="value" class="city-additional-info">
                        {{ value }}
                      </div>
                    </scope-value>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="modal_container loading">
      <img src="~/assets/images/checking.svg">
    </div>
  </transition>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import Vue from 'vue'
// eslint-disable-next-line camelcase
import { close_accent } from '~/assets/js/icons'
import { CITY_POPULATION_SHOW_THRESHOLD, POPULAR_CITIES_IDS } from '~/consts'
import { ISelectedCity } from '~/types/location'

const collator = new Intl.Collator('ru-RU')

export default Vue.extend({
  data () {
    return {
      allLoading: true,
      filterLoading: false,
      errorDetect: false,
      icons: { close_accent },
      searchString: '',
      fullCityList: [] as ISelectedCity[],
      filterCityList: [] as ISelectedCity[],
      searchCity: debounce((search: string) => {
        this.$vuex.location.cities.FilterItems({ name__icontains: search })
          .then((ids) => {
            // @ts-expect-error
            this.filterCityList = [...ids.map(el => this.$vuex.location.cities.byId(el)!)]
            // @ts-expect-error
            this.filterLoading = false
          })
      }, 500)
    }
  },
  computed: {
    filteredCityList (): ISelectedCity[] {
      return this.filterCityList.length === 0
        ? this.fullCityList
        : this.filterCityList
    },
    popularCityList (): ISelectedCity[] {
      return this.fullCityList.filter(el => POPULAR_CITIES_IDS.includes(el.id))
    },
    showData () : Record<string, ISelectedCity[]> {
      const obj = this.filteredCityList.reduce((acc, city) => {
        const cityLetter = city.name[0].toLocaleUpperCase()
        if (cityLetter in acc) {
          acc[cityLetter].push(city)
        } else {
          acc[cityLetter] = [city]
        }
        return acc
      }, {} as Record<string, ISelectedCity[]>)
      return Object.keys(obj)
        .sort(collator.compare)
        .reduce((acc, letter) => {
          return {
            ...acc,
            [letter]: obj[letter].sort((a, b) => collator.compare(a.name, b.name))
          }
        }, {})
    }
  },
  watch: {
    searchString (val: string) {
      if (!val) {
        this.filterCityList = []
        this.filterLoading = false
      } else {
        this.filterLoading = true
        this.searchCity(val)
      }
    }
  },
  mounted () {
    this.$vuex.location.cities.FilterItems({ population__gte: CITY_POPULATION_SHOW_THRESHOLD })
      .then((ids: number[]) => {
        this.fullCityList = ids.map(id => this.$vuex.location.cities.byId(id)!)
        this.allLoading = false
      })
  },
  methods: {
    async chooseHandler (item: ISelectedCity): Promise<void> {
      await this.$vuex.location.SetCityByFilter({ slug: item.slug })
      this.changeDomain(item.slug)
    },
    getCityRegionAdd (fullname?: string) {
      const arr = (fullname ?? '').split(',').map(el => el.trim())
      /**
       * От бека получаем строчки вида:
       * обл. Зажопинская, р-н Усть-перепизюйский, д Нижние ждуны
       * обл. Московская, г. Москва
       * или вообще ничего
       * Т.е. у крупных городов у нас будет массив из 0-2 элементов, а у мелких пунктов - 3 (и более)
       * Для таких возвращаем их область
       */
      if (arr.length > 2) {
        return arr[0]
      }
      return ''
    },
    async autoDetect () {
      try {
        await this.$vuex.location.SetValueFromGeolocation()
        this.changeDomain(this.$vuex.location.selectedCity?.slug || '')
        this.$emit('choose')
      } catch (e) {
        this.errorDetect = true
      }
    },
    async changeDomain (slug: string) {
      if ('street' in this.$route.params) {
        this.$router.push({
          name: 'index',
          params: {
            city: slug
          }
        })
      } else {
        this.$router.push({
          params: {
            city: slug
          }
        })
      }
      await new Promise(resolve => setTimeout(resolve, 400))
      this.$vuex.layout.cityChooser = false
    }
  }
})
</script>

<style lang="scss" scoped>
  .error {
    color: $accentPink;
  }
  .modal_container {
    max-width: 730px;
    padding: 0 24px;
    background: #fff;
    width: 100%;
    position: relative;

    a {
      cursor: pointer;
    }

    .close_btn {
      position: absolute;
      right: 15px;
      top: 5px;
      cursor: pointer;
      padding: 10px;
    }

    &.loading {
      min-height: 40vh;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 150px;
      }
    }
  }
  .city-additional-info {
    font-size: 70%;
    color: #B6B6B6;
  }
</style>
