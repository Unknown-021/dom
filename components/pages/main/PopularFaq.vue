<template>
  <section v-if="mainPage" class="popularFaq">
    <div class="container">
      <div class="popularFaq__caption">
        <h3>Популярные вопросы</h3>
      </div>
      <div class="popularFaq__list">
        <d-expand-panel v-for="({ Title, Description }, index) in mainPage.PopularQuestion" :key="index">
          <template v-slot:title>
            {{ Title }}
          </template>
          <div v-html="$sanitize($replacer(Description))">
            {{ Description }}
          </div>
        </d-expand-panel>
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
