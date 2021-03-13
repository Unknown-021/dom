<template>
  <section class="provider__questions">
    <div class="container">
      <div
        v-for="(question) in provider.OfferList"
        :key="question.id"
        class="provider__questions-mobile"
      >
        <d-expand-panel>
          <template v-slot:title>
            {{ question.Title }}
          </template>
          <template><div class="options" v-html="formatedText(question.Description) || '<span>Нет выбранной опции</span>' " /></template>
        </d-expand-panel>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IProvider } from '~/types/providers'

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: () => 0
    },
    isDesktop: {
      type: Boolean
    }
  },
  data: () => ({

    selectedQuestion: 0
  }),
  computed: {
    provider (): IProvider {
      return this.$vuex.providers.byId(+this.id)!
    }
  },
  methods: {
    formatedText (text: string): string {
      return this.$sanitize(text || '')
    }
  }
})

</script>

<style lang="scss" scoped>
.options {
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
