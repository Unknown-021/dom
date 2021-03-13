<template>
  <section class="provider__tariffs" :style="{'margin-top': provider.Slider.length ? '0' : '70px'}">
    <h2>Тарифы</h2>
    <div class="container">
      <d-underline-tabs
        v-model="selectedTab"
        :items="tariffTabs"
        route="blog_type"
      />
      <transition name="fade">
        <transition-group
          v-if="selectedTabTariffs.length"
          :key="selectedTab"
          tag="div"
        >
          <div
            v-for="item in selectedTabTariffs"
            :key="item.id"
          >
            <deal-card

              :is-desktop="isDesktop"
              :item="item"
            />
          </div>
        </transition-group>
      </transition>
      <div v-if="!selectedTabTariffs.length" class="no-tarrifs">
        <span>Нет тарифов для данного провайдера</span>
      </div>
      <transition name="fade">
        <div
          v-if="$vuex.providerData.existsMoreItems[selectedTab]"
          class="load-more-wrapper"
        >
          <img v-if="loading" src="assets/images/checking.svg" alt="loading" style="width: 100px">
          <span v-if="loading">loading</span>
          <d-dot-link v-if="!loading" @click="setLoading">
            Загрузить еще
          </d-dot-link>
        </div>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { PROVIDER_PAGE_TARIFF_TYPES } from '~/consts'
import { IDealItem } from '~/types/deals'
import { TARIFF_PACKET_TYPE } from '~/types/filters'
import { IProvider } from '~/types/providers'

interface TariffTab {
  id: number;
  name: string;
  items: number;
}

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: () => 0
    }
  },
  data: () => ({
    selectedTab: TARIFF_PACKET_TYPE.UNDEFINED,
    loading: false
  }),
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    },
    isDesktop (): boolean {
      return this.$device.isDesktopOrTablet
    },
    tariffTabs () :TariffTab[] {
      return (Object.keys(PROVIDER_PAGE_TARIFF_TYPES).map(Number) as TARIFF_PACKET_TYPE[]).map(type => ({
        id: type,
        name: PROVIDER_PAGE_TARIFF_TYPES[type] || '',
        items: this.$vuex.providerData.tariffList[type]?.length || 0
      })).filter(el => !!el.items)
    },
    selectedTabTariffs (): IDealItem[] {
      return this.$vuex.providerData.tariffList[this.selectedTab] ?? []
    }
  },
  created () {
    const [firstTab] = this.tariffTabs
    if (firstTab) {
      this.selectedTab = firstTab.id
    }
  },
  methods: {
    async setLoading () {
      this.loading = true
      try {
        await this.$vuex.providerData.LoadMore(this.selectedTab)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .load-more-wrapper {
    margin: 25px 0 40px;
    text-align: center;
  }
  .no-tarrifs {
    margin: 15px 15px 45px 15px;
    display: flex;
    justify-content: center;
    font-size: 20px;

    span {
      text-align: center;
    }
  }
</style>
