<template>
  <transition name="fade">
    <div v-if="crumbs.length > 1" class="crumbs crumbs_tariff">
      <div class="container">
        <ul class="crumbsList">
          <li
            v-for="(item, index) in crumbs"
            :key="item.name"
          >
            <template v-if="item.loc && index !== lastIndex">
              <nuxt-link :to="$regionLink(item.loc)">
                {{ item.name }}
              </nuxt-link>
            </template>
            <span v-else>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { BreadcrumbItem } from '~/types/layout'

export default Vue.extend({
  computed: {
    lastIndex (): number {
      return this.crumbs.length - 1
    },
    crumbs (): BreadcrumbItem[] {
      return this.$vuex.breadcrumbs.breadcrumbs
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
