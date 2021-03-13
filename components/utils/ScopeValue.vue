<template>
  <div>
    <slot :value="value" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['value']
})
</script>
<style scoped>

</style>
