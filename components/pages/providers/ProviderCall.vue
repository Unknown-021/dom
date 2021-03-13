<template>
  <section class="provider__call">
    <div class="provider__call-body">
      <div class="provider__call-top">
        <div class="provider__call-title">
          Удобнее подобрать тариф по телефону? Звоните!
        </div>
        <div class="provider__call-phone">
          <a href="tel:${$cmsPhone(8800335565)}">8 800 355 55 55</a><span>Бесплатный звонок по РФ</span>
        </div>
      </div>
      <div class="provider__call-back">
        <div class="provider__call-back-text">
          Либо вы можете заказать
        </div>
        <a class="link link_dotted link_accent">
          <div class="link__icon">
            <img src="~/assets/images/sprite-svg/arrow-right.svg">
          </div>
          <div class="link__text">Обратный звонок</div>
        </a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>

</style>
