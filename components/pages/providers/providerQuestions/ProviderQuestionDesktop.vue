<template>
  <section class="provider__questions">
    <div class="container">
      <div class="provider__questions-desktop">
        <ul class="provider__questions-list">
          <li
            v-for="(question, index) in provider.OfferList"
            :key="question.id"
          >
            <button @click="selectedQuestion = index">
              {{ question.Title }}
            </button>
          </li>
        </ul>
        <transition name="fade" mode="out-in" tag="div">
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <div v-for="(offer, index) in provider.OfferList" v-if="index === selectedQuestion" :key="offer.id" class="provider__questions-description">
            <div class="provider__questions-description-body">
              <h3>{{ offer.Title }}</h3>
              <div v-html="formatedText(offer.Description) || '<span>Нет выбранной опции</span>' " />
            </div>
          </div>
        </transition>
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
button {
  text-align: left;
}
</style>
