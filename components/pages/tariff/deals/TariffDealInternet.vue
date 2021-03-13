<template>
  <tariff-deal-layout
    name="Интернет"
    :add="showAdd"
    @add="chooseDevice = true"
  >
    <template v-slot:header-icon>
      <img src="~/assets/images/sprite-svg/internet-accent.svg">
    </template>
    <template v-slot:header-info>
      <div class="tariffItem__header-cost">
        <div class="tariffItem__header-cost-value">
          {{ item.speed }}
        </div>
        <div class="tariffItem__header-cost-period">
          {{ item.units }}
        </div>
      </div>
      <div class="tariffItem__header-description">
        <technology-viewer :type="1" :techs="tariff.technology" />
      </div>
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
import { DEAL_SERVICE_TYPE, ServiceInternet } from '~/types/deals'

export default TariffDealBaseFabric(DEAL_SERVICE_TYPE.INTERNET).extend({
  props: {
    item: {
      type: Object as PropType<ServiceInternet>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
