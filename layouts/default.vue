<template>
  <div class="layout">
    <l-header />
    <main class="main">
      <bread-crumbs />
      <slot>
        <transition
          tag="div"
          name=""
          mode="out-in"
        >
          <Nuxt />
        </transition>
      </slot>
    </main>
    <l-footer />
    <city-chooser />
    <call-back-modal />
    <bug-report-modal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  components: {
    'l-header': () => import('~/components/layout/header.vue'),
    'l-footer': () => import('~/components/layout/footer.vue')
  },
  head () {
    return {
      link: [
        {
          href: require('~/assets/images/loader.svg'),
          rel: 'prefetch',
          as: 'image'
        },
        {
          href: require('~/assets/images/checking.svg'),
          rel: 'prefetch',
          as: 'image'
        }
      ]
    }
  }
})
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
    font-family: "SF Pro Text",Verdana,Arial,sans-serif;
    min-width: 320px;
    height: 100%;
  }
</style>
