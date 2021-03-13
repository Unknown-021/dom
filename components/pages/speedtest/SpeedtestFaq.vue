<template>
  <section v-if="speedPageFaq" class="speedtest__faq">
    <div class="container">
      <h2>Часто задаваемые вопросы</h2>
      <div class="speedtest__faq-list">
        <d-expand-panel v-for="({ Title, Description }, index) in speedPageFaq.PopularQuestion" :key="index">
          <template v-slot:title>
            {{ Title }}
          </template>
          <p>{{ Description }}</p>
        </d-expand-panel>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    speedPageFaq () {
      return this.$vuex.layout.mainPage
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
