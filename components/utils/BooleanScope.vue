<template>
  <div>
    <slot :change="change" :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    value: false
  }),
  methods: {
    change (): void {
      this.value = !this.value
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
