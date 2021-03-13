<template>
  <div
    class="inputPlaceholder "
    :class="[...classList, !!label ? 'is-active' : '']"
    @mouseover="showArrows = true"
    @mouseleave="showArrows = false"
  >
    <input v-model="internalValue" class="input" type="number">
    <div v-if="label" class="inputPlaceholder__label">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import BaseInput from './BaseInput'
// eslint-disable-next-line camelcase
import { arrow_up_primary, arrow_down_primary } from '~/assets/js/icons'

export default BaseInput.extend({
  props: {
    value: {
      type: Number,
      default: () => 0
    },
    min: {
      type: Number,
      default: () => Number.MIN_SAFE_INTEGER
    },
    max: {
      type: Number,
      default: () => Number.MAX_SAFE_INTEGER
    },
    step: {
      type: Number,
      default: () => 1
    },
    rules: {
      type: String,
      default: () => ''
    }
  },
  watch: {
    internalValue (val: number, oldval: number) {
      if (this.rules.length && val > this.maxValue) {
        this.internalValue = this.maxValue
        return
      }
      if (this.rules.length && val < this.minValue) {
        return
      }
      if (val !== oldval) {
        this.$emit('input', Number(val))
      }
    },
    value (val: number) {
      this.internalValue = val
    }
  },
  data: () => ({
    showArrows: false,
    icons: {
      arrow_up_primary,
      arrow_down_primary
    },
    internalValue: 0,
    minValue: 0,
    maxValue: 0
  }),
  methods: {
    plusValue () {
      const newValue = this.internalValue + this.step
      this.internalValue = Math.min(newValue, this.max)
    },
    minusValue () {
      const newValue = this.internalValue - this.step
      this.internalValue = Math.max(newValue, this.min)
    }
  },
  mounted () {
    this.internalValue = Math.max(this.min, this.value)
    if (this.label && this.rules.length) {
      const numberPattern = /\d+/g
      const betweenRules = this.rules.split('|')[2].match(numberPattern)
      const tempMin = betweenRules?.[0]
      const tempMax = betweenRules?.[1]
      this.minValue = Number(tempMin)
      this.maxValue = Number(tempMax)
    }
  }
})
</script>

<style lang="scss" scoped>
  .inputPlaceholder__label {
    user-select: none;
  }
  .input {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
</style>
