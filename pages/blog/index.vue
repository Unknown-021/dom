<template>
  <div class="blog">
    <div class="headerInfo">
      <div class="container">
        <div class="headerInfo-value">
          <div class="headerInfo-content">
            <ValidationObserver v-slot="{ handleSubmit }" slim="slim">
              <div class="headerInfo-search">
                <ValidationProvider v-slot="{ errors }" rules="required" name="поисковая строка" slim="slim">
                  <d-text-input class="search_article_input" :error="!!errors.length" label="Поиск статьи" @keydown.native.enter="handleSubmit(doSearch)">
                    <template v-slot:prepend>
                      <img alt="headerInfo" title="blog image info" class="headerInfo-search__icon" src="~/assets/images/sprite-svg/search.svg">
                    </template>
                  </d-text-input>
                </ValidationProvider>
                <d-btn primary="primary" submit="submit" @click="handleSubmit(doSearch)">
                  Найти статью
                </d-btn>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
    <blog-most-popular />
    <!-- <blog-subscribe-section /> -->
    <blog-sections />
    <blog-new-articles />
    <blog-partners-news />
    <blog-usefull-articles />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({ $vuex, error }) {
    try {
      await Promise.all([
        $vuex.blog.BlogInit(),
        $vuex.breadcrumbs.SetBlogCrumbs(),
        $vuex.layout.GetBlogPage()
      ])
    } catch (e) {
      error({
        statusCode: e?.response?.status ?? 500,
        message: e.message
      })
    }
  },
  data: () => ({
    searchString: ''
  }),
  methods: {
    doSearch () {
    }
  },
  head () {
    return this.$GenerateMeta(this.$vuex.layout.blogPageSeo ?? [])
  }

})
</script>

<style lang="scss" scoped>
  .search_article_input {
    width: 100%;
    margin-right: 44px;

    .inputPlaceholder__label {
      left: 28px;
    }
  }

  .headerInfo-search__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 12px;
    z-index: 1;
  }
</style>
