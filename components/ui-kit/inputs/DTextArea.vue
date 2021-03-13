<template>
  <div class="inputPlaceholder" :class="classList">
    <slot name="prepend" />
    <textarea
      v-model="model"
      class="textarea"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="!label || isActive ? placeholder : ''"
      @focus="isActive = true"
      @blur="isActive = false"
    />
    <div v-if="label" class="inputPlaceholder__label">
      {{ label }}
    </div>
    <slot name="append" />
  </div>
</template>

<script lang="ts">
import BaseInput from './BaseInput'

export default BaseInput.extend({
  props: {
    rows: {
      type: String,
      default: () => ''
    },
    maxlength: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    stateValue: ''
  }),
  computed: {
    model: {
      get (): string {
        return this.stateValue ?? this.value
      },
      set (val: string) {
        this.stateValue = val
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    this.stateValue = this.model
  }
})
</script>

<style lang="scss" scoped>
  .inputPlaceholder {
    display: flex;
    align-items: center;

    &::v-deep {
      img {
        max-height: 100%;
      }
    }
  }
</style>
