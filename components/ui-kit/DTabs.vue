<template>
  <div class="promo__form-caption">
    <label
      v-for="item in items"
      :key="item[itemValue]"
      class="promo__form-caption-item"
    >
      <input v-model="internalValue" type="radio" :value="item[itemValue]">
      <span class="promo__form-caption-indicator">{{ item[itemName] }}</span>
    </label>
  </div>
</template>

<script lang="ts">
import TabsBase from './DTabsBase'

export default TabsBase.extend({})
</script>

<style lang="scss" scoped>

</style>
