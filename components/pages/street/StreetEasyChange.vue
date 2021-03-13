<template>
  <section v-if="streetPage" class="street__easy-change">
    <div class="container">
      <h2>{{ streetPage.FieldWithImage.Title }}</h2>
      <div class="street__easy-change-reasons-list">
        <article v-for="(pageArticle, index) in streetPage.FieldWithImage.ArticleWithImage" :key="pageArticle.Title" class="street__easy-change-reasons-article">
          <div class="street__easy-change-reasons-article-left">
            <img :src="imgList[index]" alt="">
          </div>
          <div class="street__easy-change-reasons-article-right">
            <h3>
              {{ pageArticle.Title }}
            </h3>
            <div v-html="$sanitize($replacer(pageArticle.Description))" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { IStreetPageComponent } from '~/types/layout'

export default Vue.extend({
  data: () => ({
    imgList: [
      require('~/assets/images/sprite-svg/live-chat.svg'),
      require('~/assets/images/sprite-svg/like.svg'),
      require('~/assets/images/sprite-svg/wifi-router-red.svg'),
      require('~/assets/images/sprite-svg/goal.svg')
    ]
  }),
  computed: {
    streetPage (): IStreetPageComponent|null {
      return this.$vuex.layout.streetPage
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
