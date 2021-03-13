<template>
  <div class="tariffEquipmentItem filled">
    <div class="tariffEquipmentItem__header">
      <div class="tariffEquipmentItem__thumb">
        <img v-if="itemImg" :src="$cmsImg(itemImg)" alt="">
        <img v-else src="~/assets/images/sprite-svg/wifi-router-accent.svg" alt="">
      </div>
      <div class="tariffEquipmentItem__title">
        {{ item.display }}
      </div>
      <div class="tariffEquipmentItem__control">
        <d-dot-link accent @click="changeHandler">
          Изменить
        </d-dot-link>
      </div>
    </div>
    <div class="tariffEquipmentItem__content">
      <div class="tariffEquipmentItem__specs" v-html="itemText" />
      <div class="tariffEquipmentItem__counts">
        <div class="tariffEquipmentItem__count">
          <d-number-input v-model="count" :min="0" />
        </div>
        <div class="tariffEquipmentItem__conditions" />
        <div class="tariffEquipmentItem__summary">
          <tariff-device-price :item="item" :count="count" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SANITIZE_CONFIGS } from '~/consts'
import { DealDevice } from '~/types/deals'
import { DealSelectedDevice } from '~/types/dealsOptions'
import { CmsDeviceDetail, DeviceDetail } from '~/types/device'

export default Vue.extend({
  props: {
    tariffId: {
      type: Number,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    }
  },
  computed: {
    itemOptions (): DealSelectedDevice {
      return this.$vuex.deals.dealsOptions.dealOptions(this.tariffId).devices[this.itemId]
    },
    item (): DealDevice {
      return this.$vuex.deals.dealsOptions.deal(this.tariffId).device_use.find(el => el.device === this.itemId)!
    },
    itemDetail (): CmsDeviceDetail|DeviceDetail {
      return this.$vuex.device.byId(this.item.device)! || this.$vuex.backDevice.byId(this.item.device)
    },
    itemText (): string {
      return this.$sanitize((this.itemDetail as DeviceDetail).text || this.itemDetail.description || '', SANITIZE_CONFIGS.DEVICE_ITEM)
    },
    itemDetailCMS (): CmsDeviceDetail {
      return this.$vuex.device.byId(this.item.device)!
    },
    itemImg ():string {
      return this.itemDetailCMS?.image[0]?.url ?? ''
    },
    count: {
      get (): number {
        return this.itemOptions.count
      },
      set (count: number) {
        this.$vuex.deals.dealsOptions.AddDevice({
          id: this.tariffId,
          deviceID: this.itemId,
          count
        })
      }
    }
  },
  methods: {
    changeHandler () {
      this.$emit('change')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
