<template>
  <section v-if="mainPage" class="subscribe">
    <div class="subscribe__caption">
      <div class="container">
        <h2>{{ mainPage.FourthBlockTitle }}</h2>
        <div class="subscribe__caption-notice">
          {{ mainPage.FourthBlockDescription }}
        </div>
      </div>
    </div>
    <div class="container">
      <ValidationObserver v-slot="{ handleSubmit }" tag="form" class="subscribe__form">
        <div class="subscribe__form-icon">
          <d-icon :width="54" :height="54" color="#EE3C6B">
            {{ icons.mail }}
          </d-icon>
        </div>
        <div class="subscribe__form-input">
          <ValidationProvider v-slot="{ errors }" slim="slim" rules="required|email" name="email">
            <d-text-input v-model="email" label="E-mail" :error="errors.length > 0" />
          </ValidationProvider>
        </div>
        <div class="subscribe__form-button">
          <d-btn primary="primary" submit="submit" @click="handleSubmit(subscribe)">
            Подписаться
          </d-btn>
        </div>
      </ValidationObserver>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mail } from '~/assets/js/icons'

export default Vue.extend({
  data: () => ({
    email: '',
    icons: { mail }
  }),
  computed: {
    mainPage: {
      get () {
        return this.$vuex.layout.mainPage
      }
    }
  },
  methods: {
    subscribe () {

    }
  }
})
</script>

<style lang="scss" scoped>

</style>
