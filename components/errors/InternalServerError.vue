<template lang="pug">
.headerInfo
  .container
    .headerInfo-value
      .headerInfo-content
        .headerInfo-text Ошибка на сервере
  .container
    .errorPage__content.errorPage__content_500
      .errorPage__content-icon
        img(
          style="max-width: 220px;"
          src="~/assets/images/errors/error-500.png"
          alt=""
        )
        .errorPage__content-icon-text 500

      .errorPage__content-notice Мы уже в курсе проблемы и сейчас занимаемся ее решением. Попробуйте зайти через некоторое время.
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
