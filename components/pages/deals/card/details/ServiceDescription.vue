<template>
  <div class="card__position card__position_info">
    <div class="card__position-icon">
      <img src="~/assets/images/sprite-svg/info.svg">
    </div>
    <div class="card__position-content" v-html="formattedText" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SANITIZE_CONFIGS } from '~/consts'
import { IDealItem } from '~/types/deals'

export default Vue.extend({
  props: {
    tariff: {
      type: Object as PropType<IDealItem>,
      required: true
    }
  },
  computed: {
    formattedText (): string {
      return this.$sanitize(this.tariff.content, SANITIZE_CONFIGS.TARIFF_PAGE)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
