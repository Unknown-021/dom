<template>
  <div
    class="tariffEquipmentItem"
    :class="{ 'tariffEquipmentItem_selected': selected }"
  >
    <div class="tariffEquipmentItem__header">
      <div class="tariffEquipmentItem__thumb">
        <img v-if="itemImg" :src="$cmsImg(itemImg)" alt="">
        <img v-else src="~/assets/images/sprite-svg/wifi-router-accent.svg" alt="">
      </div>
      <div class="tariffEquipmentItem__title">
        {{ item.display }}
      </div>
      <!-- <tariff-device-price :item="item" :count="count" /> -->
    </div>
    <div class="tariffEquipmentItem__content">
      <div class="tariffEquipmentItem__specs" v-html="itemText" />
      <div class="tariffEquipmentItem__controls">
        <d-btn
          v-if="!selected"
          secondary
          @click="$emit('select', { id: item.device, count})"
        >
          Выбрать
        </d-btn>
        <div
          v-else
          class="text-right"
        >
          <div class="tariffEquipmentItem__checked">
            <img src="~/assets/images/sprite-svg/checked.svg">
            &nbsp;
            Выбрано
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SANITIZE_CONFIGS } from '~/consts'
import { DealDevice } from '~/types/deals'
import {
  CmsDeviceDetail, /* DeviceDetail */
  DeviceDetail
} from '~/types/device'

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<DealDevice>,
      required: true
    },
    selected: {
      type: Boolean
    },
    count: {
      type: Number,
      default: () => 1
    }
  },
  computed: {
    itemDetailCMS (): CmsDeviceDetail {
      return this.$vuex.device.byId(this.item.device)!
    },
    itemDetail (): DeviceDetail {
      return this.$vuex.backDevice.byId(this.item.device)!
    },
    /* itemTextCMS (): string {
      return this.$sanitize(this.itemDetailCMS.description || '', SANITIZE_CONFIGS.DEVICE_ITEM)
    }, */
    itemText (): string {
      return this.$sanitize(this.itemDetail.text || this.itemDetailCMS.description, SANITIZE_CONFIGS.DEVICE_ITEM)
    },
    itemImg ():string {
      return this.itemDetailCMS?.image[0]?.url ?? ''
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
