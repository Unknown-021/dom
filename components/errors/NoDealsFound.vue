<template lang="pug">
.errorPage
  .headerInfo
    .container
        .headerInfo-value
          .headerInfo-content
            img(:src="require('~/assets/images/sprite-svg/fail.svg')")
            .headerInfo-text Подключение недоступно
  .container
      .errorPage__content.errorPage__content_nothing
          .errorPage__content-caption
              h1 К сожалению, доступных провайдеров нет в вашем доме
          .errorPage__content-notice Это могло произойти из-за следующих причин:
          .errorPage__content-reasons
              .errorPage__content-reason
                  .errorPage__content-reason-image
                      img(:src="require('~/assets/images/errors/error-newbuilding.svg')" alt="")
                  .errorPage__content-reason-title Вы искали новостройку
              .errorPage__content-reason
                  .errorPage__content-reason-image
                      img(:src="require('~/assets/images/errors/error-estate.svg')" alt="")
                  .errorPage__content-reason-title Вы искали частный дом
              .errorPage__content-reason
                  .errorPage__content-reason-image
                      img(:src="require('~/assets/images/errors/error-server.svg')" alt="")
                  .errorPage__content-reason-title Проблема в адресной базе провайдера

          .errorPage__content-button
              a(href="#").btn.btn-secondary Сообщить об ошибке
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
