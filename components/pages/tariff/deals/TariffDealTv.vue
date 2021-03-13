<template>
  <tariff-deal-layout
    name="Телевидение"
    :add="showAdd"
    @add="chooseDevice = true"
  >
    <template v-slot:header-icon>
      <img src="~/assets/images/sprite-svg/tv-accent.svg">
    </template>
    <template v-slot:header-info>
      <div class="tariffItem__header-cost">
        <div class="tariffItem__header-cost-value">
          {{ selectedPackage && selectedPackage.channels_count || item.channels_count }}
        </div>
        <div class="tariffItem__header-cost-period">
          {{ $plural.n(selectedPackage &&selectedPackage.channels_count || item.channels_count || 0, 'канал', 'канала', 'каналов' ) }}
        </div>
      </div>
      <div v-if="hdChannelsCount" class="tariffItem__header-description">
        из них {{ hdChannelsCount }} HD
      </div>
      <!-- <div
        v-if="hasTvPackets"
        class="tariffItem__header-searchBtn"
        style="cursor: auto"
        @click="showSearch = !showSearch"
      >
        <img src="~/assets/images/sprite-svg/search.svg">
      </div> -->
    </template>
    <template v-slot:header-status>
      Включено
    </template>
    <!-- MAIN SLOT START -->
    <transition name="fade">
      <!-- <div v-if="showSearch" class="tvPackage_search"> -->
      <div v-if="false" class="tvPackage_search">
        <div class="tvPackage__search">
          <d-text-input
            v-model="searchChannel"
            label="Поиск по каналам"
            class="search-field"
          />
          <div class="tvPackage__search-close">
            <d-dot-link accent @click="showSearch = false">
              <img src="~/assets/images/sprite-svg/close-accent.svg">
              Закрыть
            </d-dot-link>
          </div>
        </div>
      </div>
    </transition>
    <template v-if="hasTvPackets">
      <tariff-channels-wrapper
        :items="item.packages_use"
        :tariff="tariff"
        :search="searchChannel"
      />
    </template>
    <transition-group name="fade" mode="out-in">
      <template v-if="!chooseDevice">
        <tariff-device-choosen-item
          v-for="deviceID in selected"
          :key="deviceID"
          :tariff-id="tariff.id"
          :item-id="deviceID"
          @change="itemChangeHandler(deviceID)"
        />
      </template>
      <tariff-device-wrapper
        v-if="chooseDevice"
        :id="tariff.id"
        key="item-chooser"
        :items="devices"
        :selected="selected"
        :selected-id="selectedEdit"
        @close="itemCloseHandler"
      >
        <!-- Renaming scope variables cause that name already used in upper scope -->
        <template v-slot="{ item: scopeItem, selected: scopeSelected, count }">
          <tariff-device-default-item
            :key="scopeItem.device"
            :item="scopeItem"
            :selected="scopeSelected"
            :count="count"
            @select="selectHandler"
          />
        </template>
      </tariff-device-wrapper>
    </transition-group>
  </tariff-deal-layout>
</template>

<script lang="ts">
import { PropType } from 'vue'
import TariffDealBaseFabric from './TariffDealBaseFabric'
import { DealDevice, DEAL_SERVICE_TYPE, ServiceTv } from '~/types/deals'

export default TariffDealBaseFabric(DEAL_SERVICE_TYPE.TV).extend({
  props: {
    item: {
      type: Object as PropType<ServiceTv>,
      required: true
    }
  },
  data: () => ({
    showSearch: false,
    searchChannel: ''
  }),
  watch: {
    showSearch (val: boolean) {
      if (!val) {
        this.searchChannel = ''
      }
    }
  },
  computed: {
    devices (): DealDevice[] {
      return this.tariff.device_use.filter(el => el.services.length === 1 && el.services.includes(this.type))
    },
    selectedPackage () {
      const id = this.$vuex.deals.dealsOptions.dealOptions(this.tariff.id).tv_package
      if (!id) {
        return undefined
      }
      return this.$vuex.tvPackage.byId(id)
    },
    hdChannelsCount (): number {
      return this.selectedPackage?.hd_channels_count || 0
    },
    hasTvPackets (): boolean {
      return !!this.item.packages_use.length
    }
  }
})
</script>

<style lang="scss" scoped>
  .tvPackage__search {
    .search-field {
      flex-grow: 1;
      margin-right: 10px;
    }
  }
</style>
