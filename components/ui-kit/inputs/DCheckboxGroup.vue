<template>
  <div>
    <label
      v-for="item in items"
      :key="item[itemValue]"
      class="filterCheckbox filterCheckbox_inline"
      :style="{
        display: options
          ? options.fullwidth
            ? 'block'
            : 'inline-block'
          : 'inline-block',
      }"
    >
      <input v-model="internalValue" type="checkbox" :value="item[itemValue]">
      <slot :item="item">
        <span class="filterCheckbox__text">{{ item[itemName] }}</span>
      </slot>
      <span class="filterCheckbox__indicator" />
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    options: {
      type: Object as PropType<{ fullwidth: boolean }>,
      default: () => {}
    },
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    itemName: {
      type: String,
      default: () => 'name'
    },
    itemValue: {
      type: String,
      default: () => 'id'
    }
  },
  data: () => ({
    internalValue: [] as string[]
  }),
  watch: {
    internalValue (val: string[]) {
      if (val.length !== this.value.length) {
        this.$emit('input', val.sort())
      }
    },
    value (val: string[]) {
      if (JSON.stringify(val) !== JSON.stringify(this.internalValue)) {
        this.internalValue = [...val]
      }
    }
  },
  created () {
    this.internalValue = [...this.value]
  }
})
</script>

<style lang="scss" scoped>

</style>
