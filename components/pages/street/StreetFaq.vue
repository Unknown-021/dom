<template>
  <section v-if="streetPageFaq" class="street__faq">
    <div class="container">
      <h2>Часто задаваемые вопросы</h2>
      <div class="street__faq-list">
        <d-expand-panel v-for="({ Title, Description, id }) in streetPageFaq.PopularQuestion" :key="id">
          <template v-slot:title>
            {{ Title }}
          </template>
          <div v-html="$sanitize(Description)" />
        </d-expand-panel>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { IMainPageComponent } from '~/types/deals'

export default Vue.extend({
  computed: {
    streetPageFaq (): IMainPageComponent|null {
      return this.$vuex.layout.mainPage
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
