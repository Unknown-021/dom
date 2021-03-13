<template>
  <div class="inputPlaceholder" :class="classList">
    <slot name="prepend" />
    <input
      v-model="model"
      class="input"
      type="text"
      :placeholder="!label || isActive ? placeholder : ''"
      @focus="isActive = true"
      @blur="isActive = false"
    >
    <div v-if="label" class="inputPlaceholder__label">
      {{ label }}
    </div>
    <slot name="append" />
  </div>
</template>

<script lang="ts">
import BaseInput from './BaseInput'

export default BaseInput.extend({
  data: () => ({
    stateValue: ''
  }),
  computed: {
    model: {
      get () {
        return this.value || this.stateValue || ''
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

  .search_article_input {
    .inputPlaceholder__label {
      left: 28px;
    }
  }
</style>
