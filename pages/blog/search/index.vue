<template>
  <nuxt-link to="/blog/search?search=testtest">
    fdgdfgdfg
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlogPreviewItem } from '~/types/blog'

export default Vue.extend({
  asyncData ({ query, error, req }) {
    try {
      const searchString = query.search

      return {
        blogItems: [],
        needRequest: !req,
        searchString
      }
    // eslint-disable-next-line no-unreachable
    } catch (e) {
      error({
        statusCode: 500,
        message: e.message
      })
    }
  },
  data: () => ({
    blogItems: [] as BlogPreviewItem[],
    needRequest: true,
    searchString: ''
  }),
  middleware ({ query, redirect }) {
    if (!query.search) {
      redirect(301, '/blog/')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
