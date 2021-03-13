<template>
  <div>
    <not-found-page v-if="error.statusCode === 404 || error.statusCode === 400" />
    <no-deals-found v-else-if="error.statusCode === 444" />
    <internal-server-error v-else />
  </div>
</template>

<script lang="ts">
import { NuxtError } from '@nuxt/types'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      required: true
    }
  },
  layout: 'default'
})
</script>

<style lang="scss" scoped>

</style>
