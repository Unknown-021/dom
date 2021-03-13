<template lang="pug">
.loader
  .loader__title Ищем выгодные тарифы
  .loader__city
    slot Ростелеком
  .loader__icon
      img(:src="require('~/assets/images/loader.svg')")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
