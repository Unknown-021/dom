<template>
  <section v-if="mainPage" class="connection">
    <div class="container">
      <div class="connection__caption">
        <h2>Как будет происходить подключение</h2>
      </div>
      <div class="connection__steps">
        <div class="connection__steps-item connection__steps-item_first">
          <div class="connection__steps-item-number">
            1
          </div>
          <div class="connection__steps-item-image">
            <img src="~/assets/images/connection/step-1.webp" style="max-width: 200px" alt="">
            <img class="connection__steps-item-image_large" style="max-width: 200px" src="~/assets/images/connection/step-1.webp" alt="">
          </div>
          <div class="connection__steps-item-description">
            {{ mainPage.FirstConnectionStep }}
          </div>
          <div class="connection__steps-item-arrow">
            <img src="~/assets/images/connection/step-1-arrow.svg" alt="">
          </div>
        </div>
        <div class="connection__steps-item connection__steps-item_second">
          <div class="connection__steps-item-number">
            2
          </div>
          <div class="connection__steps-item-image">
            <img src="~/assets/images/connection/step-2.webp" style="max-width:180px" alt="">
            <img class="connection__steps-item-image_large" style="max-width:180px" src="~/assets/images/connection/step-2.webp" alt="">
          </div>
          <div class="connection__steps-item-description">
            {{ mainPage.SecondConnectionStep }}
          </div>
          <div class="connection__steps-item-arrow">
            <img src="~/assets/images/connection/step-2-arrow.svg" alt="">
          </div>
        </div>
        <div class="connection__steps-item connection__steps-item_third">
          <div class="connection__steps-item-number">
            3
          </div>
          <div class="connection__steps-item-image">
            <img src="~/assets/images/connection/step-3.webp" style="max-width:176px" alt="">
            <img class="connection__steps-item-image_large" style="max-width:176px" src="~/assets/images/connection/step-3.webp" alt="">
          </div>
          <div class="connection__steps-item-description">
            {{ mainPage.ThirdConnectionStep }}
          </div>
          <div class="connection__steps-item-arrow">
            <img src="~/assets/images/connection/step-3-arrow.svg" alt="">
          </div>
        </div>
        <div class="connection__steps-item connection__steps-item_fourth">
          <div class="connection__steps-item-number">
            4
          </div>
          <div class="connection__steps-item-image">
            <img src="~/assets/images/connection/step-4.webp" style="max-width:155px" alt="">
            <img class="connection__steps-item-image_large" style="max-width:155px" src="~/assets/images/connection/step-4.webp" alt="">
          </div>
          <div class="connection__steps-item-description">
            {{ mainPage.FourthConnectionStep }}
          </div>
          <div class="connection__steps-item-arrow">
            <img src="~/assets/images/connection/step-4-arrow.svg" alt="">
          </div>
        </div>
        <div class="connection__steps-item connection__steps-item_fifth">
          <div class="connection__steps-item-image">
            <!-- <img src="~/assets/images/connection/step-5.svg" style="max-width: 275px;" alt=""> -->
            <img class="connection__steps-item-image_large" style="max-width: 400px;" src="~/assets/images/connection/step-5-large.webp" alt="">
          </div>
          <div class="connection__steps-item-description">
            <!-- <span class="connection__steps-item-description_bold">Готово!</span> --> {{ mainPage.FifthConnectionStep }}
          </div>
          <div class="connection__steps-item-arrow">
            <img src="~/assets/images/connection/step-5-arrow.svg" alt="">
          </div>
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

</style>
