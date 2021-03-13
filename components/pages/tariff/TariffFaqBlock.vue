<template>
  <div class="popularFaq__list">
    <d-expand-panel
      v-for="(item, index) in items"
      :key="index"
    >
      <template v-slot:title>
        {{ item.Title }}
      </template>
      <div v-html="$sanitize(item.Description || '') " />
    </d-expand-panel>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ITariffBlockPage } from '~/types/layout'
export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<ITariffBlockPage['FildsWithImage']['Items']>,
      required: true
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
