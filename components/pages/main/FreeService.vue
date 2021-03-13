<template>
  <section v-if="mainPage" class="freeService">
    <div class="container">
      <div class="freeService__caption">
        <img src="~/assets/images/sprite-svg/logo.svg" alt="main-logo" style="margin-bottom: 33px;">
        <h3>{{ mainPage.SecondTitleBlock }}</h3>
      </div>
      <div class="freeService__content">
        <p>{{ mainPage.SecondBlockDescription }}</p>
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
