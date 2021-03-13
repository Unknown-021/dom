<template>
  <div class="tariffItem__addEquipment">
    <div class="tariffItem__addEquipment-header">
      <div class="tariffItem__addEquipment-header-caption">
        Выберите оборудование
      </div>
      <div class="tariffItem__addEquipment-header-count">
        <div v-if="!internet" class="tariffEquipmentItem__count">
          <d-select
            v-model="count"
            :items="[{id: 0, name: '0'},{id: 1, name: '1'},{id: 2, name: '2'},{id: 3, name: '3'}]"
            item-name="name"
            item-value="id"
            mandatory
          />
        </div>
        <div class="tariffEquipmentItem__conditions">
          <d-select
            v-model="type"
            :items="types"
            item-name="name"
            item-value="id"
            mandatory
          />
        </div>
      </div>
      <div class="tariffItem__addEquipment-header-close">
        <d-dot-link accent @click="$emit('close')">
          <img src="~/assets/images/sprite-svg/close-accent.svg">
          &nbsp;
          Закрыть
        </d-dot-link>
      </div>
    </div>
    <transition-group name="fade">
      <template
        v-for="item in filteredItems"
      >
        <slot
          :item="item"
          :item-detail="$vuex.device.byId(item.device)"
          :selected="selected.includes(item.device)"
          :count="count"
        >
          <!-- /// -->
        </slot>
      </template>
      <div
        v-if="!!selectedId"
        key="dont-needed"
        class="tariffEquipmentItem tariffEquipmentItem_not-required"
      >
        <div class="tariffEquipmentItem__header">
          <div class="tariffEquipmentItem__thumb">
            <img src="~/assets/images/sprite-svg/not-required.svg">
          </div>
          <div class="tariffEquipmentItem__title text-gray">
            Оборудование не требуется
          </div>
        </div>
        <div class="tariffEquipmentItem__content">
          <div class="tariffEquipmentItem__controls">
            <d-btn
              v-if="!!selected.length"
              secondary
              @click="unselect"
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
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DealDevice } from '~/types/deals'
import { IDevicePaymentMethod } from '~/types/tariff'

export default Vue.extend({
  props: {
    internet: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: Number,
      required: true
    },
    items: {
      type: Array as PropType<DealDevice[]>,
      default: () => []
    },
    selected: {
      type: Array as PropType<number[]>,
      default: () => []
    },
    selectedId: {
      type: Number,
      default: () => 0
    }
  },
  data: () => ({
    count: 0,
    type: 0
  }),
  computed: {
    types (): IDevicePaymentMethod[] {
      return this.$vuex.tariff.devicePayment.all
        .filter(el => this.items.some(i => i.method === el.id))
    },
    filteredItems (): DealDevice[] {
      return this.items
        .filter(el => !this.type || el.method === this.type)
    }
  },
  methods: {
    unselect () {
      if (this.selectedId) {
        this.$vuex.deals.dealsOptions.DELETE_SELECTED_DEVICE({ id: this.id, itemsIDs: [this.selectedId] })
      }
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
