<template>
  <label class="inputCheckboxToggle">
    <input v-model="model" type="checkbox">
    <span class="inputCheckboxToggle__indicator" />
  </label>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    internalValue: false
  }),
  computed: {
    model: {
      get (): boolean {
        return this.internalValue
      },
      set (val: boolean) {
        this.internalValue = val
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value (val: boolean, oldval: boolean) {
      if (val !== oldval) {
        this.internalValue = val
      }
    }
  },
  created () {
    this.internalValue = this.value
  }
})
</script>

<style lang="scss" scoped>
.inputCheckboxToggle {
  cursor: pointer;
}
</style>
