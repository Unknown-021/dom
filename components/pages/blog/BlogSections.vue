<template>
  <section class="blogSections">
    <div class="container">
      <div class="tabs">
        <d-underline-tabs v-model="selectedTab" :items="blogTypes" route="blog_type" />
      </div>
      <transition class="tabs-list" name="fade" tag="div" mode="out-in">
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <div v-for="(articles, key) in blogArticles" v-if="key === selectedTab" :key="`${key}`" class="tab" :class="[key]">
          <div class="blogList">
            <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
            <nuxt-link
              v-for="(article) in articles.results"
              :key="article.slug"
              class="blogListItem"
              :to="$regionLink({ name: 'blog-id', params: { id: article.slug } })"
            >
              <div class="blogListItem__image">
                <div class="blogListItem__time">
                  <template v-if="article.timeToRead">
                    <img class="time_to_read" src="~/assets/images/sprite-svg/time.svg">{{ article.timeToRead }}
                  </template>
                </div><img :src="$cmsImg(article.previewImg ? article.previewImg.url : '')" alt="">
              </div>
              <div class="blogListItem__content">
                <div class="blogListItem__title">
                  {{ article ? article.Title : '' }}
                </div>
              </div>
            </nuxt-link>
          </div>
          <div class="blogSections__more">
            <d-dot-link v-if="articles.more" accent="accent" @click="downloadMore(key)">
              Загрузить еще
            </d-dot-link>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    selectedTab: ''
  }),
  computed: {
    blogTypes () {
      return this.$vuex.blog.blogCategories
    },
    blogArticles () {
      return this.$vuex.blog.blogPreviewsByCategories
    }
  },
  methods: {
    downloadMore (key: string) {
      this.$vuex.blog.GetBlogCategoryMore(key)
    }
  }
})
</script>

<style lang="scss" scoped>
  .blogSections .blogListItem__title:before {
    content: url("~assets/images/sprite-svg/arrow-right.svg");
    display: inline-block;
    padding: 0;
    opacity: 0;
    position: absolute;
    left: -12px;
    top: 4px;
    line-height: 1;
    font-size: 0;
    transition: opacity 0.3s ease;
  }
  .time_to_read {
    margin-right: 7px;
  }
</style>
