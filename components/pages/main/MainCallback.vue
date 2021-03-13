<template>
  <section class="callback">
    <div class="callback__content">
      <div class="callback__caption">
        <h2>Удобнее подобрать тариф по телефону? <br> Звоните!</h2>
      </div>
      <div class="callback__section">
        <div v-if="mainPage" class="callback__tel">
          <a class="callback__tel-number" :href="'tel:' + $cmsPhone(mainPage.MainNumber)">{{ mainPage.MainNumber }}</a>
          <div class="callback__tel-notice">
            Бесплатный звонок по РФ
          </div>
        </div>
        <div class="callback__operator">
          <div class="callback__operator-text">
            Либо вы можете заказать
          </div>
          <d-dot-link @click="$vuex.layout.callBack = true">
            <template v-slot:prependIcon="{ hover }">
              <img v-if="!hover" alt="arrow" src="~/assets/images/sprite-svg/arrow-right-hover.svg"><img v-else alt="arrow" src="~/assets/images/sprite-svg/arrow-right-red.svg">
            </template>Обратный звонок
          </d-dot-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    mainPage: {
      get () {
        return this.$vuex.layout.mainPage
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.callback__content {
    display: flex;
    flex-direction: column;
    //align-items: center;
    justify-content: center;
    margin: 72px auto;
}
.callback__caption {
    max-width: 100%;
    //text-align: center;
}
</style>
