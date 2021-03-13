<template>
  <tariff-deal-layout name="Мобильная связь">
    <template v-slot:header-icon>
      <img src="~/assets/images/sprite-svg/mobile-accent.svg">
    </template>
    <template v-slot:header-info>
      <div class="tariffItem__header-container">
        <div
          v-for="unit in dealsInfo"
          :key="unit.unit"
          class="tariffItem__header-info"
        >
          <div class="tariffItem__header-cost">
            <div class="tariffItem__header-cost-value" v-html="unit.value">
              <!--  {{ unit.value }} -->
            </div>
            <div class="tariffItem__header-cost-period">
              {{ unit.unit }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:header-status>
      Включено
    </template>
  </tariff-deal-layout>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { UNLIMITED_MODILE_TRAFFIC } from '~/consts'
import { IDealItem, ServiceMobile } from '~/types/deals'

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<ServiceMobile>,
      required: true
    },
    tariff: {
      type: Object as PropType<IDealItem>,
      required: true
    }
  },
  computed: {
    dealsInfo (): Array<{ value: string|number, unit: string }> {
      return [
        {
          value: this.item.gigabytes === UNLIMITED_MODILE_TRAFFIC ? '<span class="unlimited">∞</span>' : `${'<span>' + this.item.gigabytes + '</span>'}`,
          unit: 'Гб'
        },
        {
          value: this.item.minutes,
          unit: 'мин'
        },
        {
          value: this.item.sms,
          unit: 'sms'
        }
      ].filter(el => Boolean(el.value))
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
