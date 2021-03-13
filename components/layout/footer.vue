<template>
  <footer class="footer">
    <div class="container footer__wrapper">
      <div class="footer__container">
        <div class="footer__logo">
          <nuxt-link class="logo" :to="$regionLink({ name: 'index' })">
            ДомИнтернет
          </nuxt-link>
        </div>
        <div class="footer__nav">
          <div class="footer__nav-block footer__nav-block_first">
            <div class="footer__nav-item footer__nav-item_bold">
              <nuxt-link :to="$regionLink({ name: 'tariffs' })">
                Тарифы
              </nuxt-link>
            </div>
            <template v-if="tariffs">
              <div
                v-for="item in tariffs.variants"
                :key="item.id"
                class="footer__nav-item"
              >
                <nuxt-link :to="getTariffRoute(item.id)">
                  {{ item.name }}
                </nuxt-link>
              </div>
            </template>
          </div>
          <div class="footer__nav-block footer__nav-block_last">
            <div class="footer__nav-item footer__nav-item_bold">
              <a href="mailto:privet@internet-tariff.ru">Сотрудничество</a>
            </div>
            <div class="footer__nav-item footer__nav-item_bold">
              <a @click="$vuex.layout.bugReport = true">Сообщить об ошибке</a>
            </div>
          </div>
          <div class="footer__nav-block footer__nav-block_callback">
            <div class="footer__callback">
              <a class="footer__callback-link" :href="'tel:' + $cmsPhone(numberPhone)">Служба поддержки и продаж</a>
              <a
                class="footer__callback-tel"
                :href="'tel:' + $cmsPhone(numberPhone)"
              >
                {{ numberPhone }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__copyright">
      <div class="container">
        <div class="footer__copyright-caption">
          © {{ currYear }} ООО «ДомИнтернет»
        </div>
        Продолжая использовать наш сайт, вы даете согласие на обработку файлов
        Cookies и других пользовательских данных, в соответствии с Политикой
        конфиденциальности.
      </div>
    </div>
  </footer>
</template>

<script lang='ts'>
import dayjs from 'dayjs'
import Vue from 'vue'
import { Location } from 'vue-router'
import { SelectFilterOption } from '~/types/filters'
export default Vue.extend({
  computed: {
    currYear (): string {
      return dayjs().format('YYYY')
    },
    numberPhone (): string {
      return this.$vuex.layout.mainPage?.MainNumber ?? ''
    },
    tariffs (): SelectFilterOption|undefined {
      return this.$vuex.filters.filterTypes.service__service_type as SelectFilterOption
    }
  },
  methods: {
    getTariffRoute (filterTariffs: number|string): Location {
      return this.$regionLink({
        name: 'tariffs',
        query: { ...this.$vuex.filters.filtersQueryParams, service__service_type: [filterTariffs].map(String) }
      })
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
