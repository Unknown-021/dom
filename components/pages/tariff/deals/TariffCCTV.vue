<template>
  <tariff-deal-layout name="Интернет" :add="showAdd" @add="chooseDevice = true">
    <template v-slot:header-icon>
      <img src="~/assets/images/sprite-svg/security-accent.svg">
    </template>
    <template v-slot:header-info>
      <div class="tariffItem__header-cost">
        <div class="tariffItem__header-cost-value">
          first field
          <!-- {{ selectedPackage && selectedPackage.channels_count || item.channels_count }} -->
        </div>
        <!-- <div class="tariffItem__header-cost-period">
          каналов
        </div> -->
      </div>
      <div class="tariffItem__header-description">
        <!-- v-if="hdChannelsCount" -->
        second field
        <!--  из них {{ hdChannelsCount }} HD -->
      </div>
      <!-- v-if="hasTvPackets" --><!-- <div
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
        :internet="true"
        @close="itemCloseHandler"
      >
        <!-- Renaming scope variables cause that name already used in upper scope -->
        <template v-slot="{ itemDetail, item: scopeItem, selected: scopeSelected, count }">
          <tariff-device-default-item
            :key="scopeItem.device"
            :item="scopeItem"
            :item-detail="itemDetail"
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
import { DEAL_SERVICE_TYPE, ServiceCCTV } from '~/types/deals'

export default TariffDealBaseFabric(DEAL_SERVICE_TYPE.CCTV).extend({
  props: {
    item: {
      type: Object as PropType<ServiceCCTV>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
