<template>
  <section v-if="useful.length" class="useful">
    <div class="container">
      <div class="useful__caption">
        <h2>Полезное</h2>
      </div>
      <div class="useful__list">
        <div v-for="item in useful" :key="item.id" class="useful__item">
          <div class="useful__item-content">
            <div class="useful__item-title">
              {{ item.Title }}
            </div>
            <div class="useful__item-announce">
              <span> {{ item.shortText }} </span>
            </div>
            <div class="useful__item-link">
              <nuxt-link
                :to="
                  $regionLink({ name: 'blog-id', params: { id: item.slug } })
                "
                class="link link_accent link_dotted"
              >
                <span class="link__icon">
                  <span class="svg-image-arrow-right svg-image-arrow-right-dims" />
                </span>
                <span class="link__text link__text_bold">Подробнее </span>
              </nuxt-link>
            </div>
          </div>
          <div class="useful__item-image">
            <img
              :src="$cmsImg(item.previewImg ? item.previewImg.url : '')"
              alt=""
            >
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
    useful () {
      return this.$vuex.blog.blogPreviewsByCategories.useful.results
    }
  },
  methods: {
    formatedText (text: string): string {
      return this.$sanitize(text ?? '')
    }
  }
})
</script>

<style lang="scss" scoped>
  .svg-image-arrow-right-dims {
    background-image: url("~assets/images/sprite-svg/arrow-right.svg");
    width: 8px;
    height: 13px;
    background-repeat: no-repeat;
  }
  img {
    max-height: 100%;
  }
</style>
