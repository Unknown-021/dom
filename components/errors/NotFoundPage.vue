<template lang="pug">
  .errorPage
    .headerInfo
      .container
        .headerInfo-value
          .headerInfo-content
            .headerInfo-text Ничего не найдено :(
    .container
      .errorPage__content.errorPage__content_404
        .errorPage__content-icon
          img(
            :src="require('~/assets/images/errors/error-404.png')"
            alt=""
          )
          .errorPage__content-icon-text 404

        .errorPage__content-notice Вы можете поискать выгодные тарифы в вашем доме

        .errorPage__content-button
          d-btn(
            v-if="$vuex.location.selectedCity"
            secondary
            :to="$regionLink({ name: 'tariffs' })"
          ) Найти тарифы
          d-btn(
            v-else
            secondary
            @click="$vuex.layout.cityChooser = true"
          ) Уточнить город
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
