<template>
  <div>
    <transition-group name="fade" mode="out-in" tag="div" class="provider-loading-list">
      <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
      <div v-for="(provider, ind) in providersNames" v-if="ind === index" :key="provider">
        {{ provider }}
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CheckboxFilterOption } from '~/types/filters'

// TODO: FIX ANIMATION

export default Vue.extend({
  data: () => ({
    index: 0,
    timeouter: 0
  }),
  computed: {
    providersNames (): string[] {
      return ((this.$vuex.filters.filterTypes.provider as CheckboxFilterOption)?.variants || []).map(el => el.name)
    }
  },
  mounted () {
    this.timeouter = window.setInterval(() => {
      this.index = this.index + 1 === this.providersNames.length ? 0 : this.index + 1
    }, 800)
  },
  beforeDestroy () {
    window.clearInterval(this.timeouter)
  }
})
</script>

<style lang="scss" scoped>
  .provider-loading-list {
    height: 27px;
    overflow: hidden;
    div:not(:first-child) {
      display: none!important;
    }
  }
</style>
