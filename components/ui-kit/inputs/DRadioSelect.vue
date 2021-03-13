<template>
  <div class="filter__service">
    <label
      v-for="item in items"
      :key="`${item[itemValue]}`"
      class="filterRadio"
    >
      <input
        :checked="item[itemValue] == internalValue"
        type="radio"
        :value="item[itemValue]"
        @click="handleInput(item[itemValue])"
      >
      <span class="filterRadio__text">{{ item[itemName] }}</span>
      <span class="filterRadio__indicator" />
    </label>
  </div>
</template>

<script lang="ts">
/* eslint-disable eqeqeq */
import Component from '~/components/ui-kit/DTabsBase'

export default Component.extend({
  props: {
    value: {
      validator: () => true,
      default: () => ''
    },
    mandatory: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    handleInput (value: any) {
      if (this.internalValue == value && !this.mandatory) {
        this.internalValue = undefined
        return
      }
      this.internalValue = value
    }
  }
})
</script>

<style lang="scss" scoped>
.filterRadio__indicator {
  background-image: url('~assets/images/sprite-svg/checked.svg');
  background-repeat: no-repeat;
  background-position: center;
  width: 18px;
  height: 13px;
}
</style>
