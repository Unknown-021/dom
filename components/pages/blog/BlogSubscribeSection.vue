<template>
  <section class="subscribe">
    <div class="subscribe__caption">
      <div v-if="blog" class="container">
        <h2>{{ blog.SubscribeSectionTitle }}</h2>
        <div class="subscribe__caption-notice">
          {{ blog.SubscribeSection }}
        </div>
      </div>
    </div>
    <div class="container">
      <ValidationObserver
        v-slot="{ handleSubmit }"
        class="subscribe__form subscribe__form_fully"
        tag="div"
      >
        <ValidationProvider
          v-slot="{ errors }"
          class="subscribe__form-input"
          rules="required"
          name="имя"
          tag="div"
        >
          <d-text-input
            v-model="form.name"
            label="Имя"
            :error="!!errors.length"
            @keydown.native.enter="handleSubmit(submitForm)"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          class="subscribe__form-input"
          rules="required|email"
          name="e-mail"
          tag="div"
        >
          <d-text-input
            v-model="form.email"
            label="E-mail"
            :error="!!errors.length"
            @keydown.native.enter="handleSubmit(submitForm)"
          />
        </ValidationProvider>
        <div class="subscribe__form-button">
          <d-btn
            secondary="secondary"
            submit="submit"
            @click="handleSubmit(submitForm)"
          >
            Подписаться
          </d-btn>
        </div>
      </ValidationObserver>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { IBlogPageComponent } from '~/types/blog'

export default Vue.extend({
  data: () => ({
    form: {
      name: '',
      email: ''
    }
  }),
  computed: {
    blog (): IBlogPageComponent| null {
      return this.$vuex.layout.blogPage
    }
  },
  methods: {
    submitForm () {}
  }
})
</script>

<style lang="scss" scoped>
</style>
